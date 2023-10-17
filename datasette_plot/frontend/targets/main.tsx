import { h, render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import {
  dot,
  dotX,
  plot,
  PlotOptions,
  linearRegressionY,
  MarkOptions,
  DotOptions,
} from "@observablehq/plot";

const dataUrl =
  window.location.origin +
  window.location.pathname +
  ".json" +
  window.location.search;

function DotForm(props: {
  columns: string[];
  onUpdate: (options: DotOptions) => void;
}) {
  const [x, setX] = useState<string>(props.columns[0]);
  const [y, setY] = useState<string>(props.columns[1]);
  const [fill, setFill] = useState<string | null>(props.columns[2]);
  useEffect(() => {
    props.onUpdate({ x, y, fill, tip: true });
  }, [x, y, fill]);
  return (
    <div>
      <div>
        <span>X</span>
        <select
          value={x}
          onChange={(e) => setX((e.target as HTMLSelectElement).value)}
        >
          {props.columns.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <span>Y</span>
        <select
          value={y}
          onChange={(e) => setY((e.target as HTMLSelectElement).value)}
        >
          {props.columns.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <span>Fill</span>
        <select
          value={fill}
          onChange={(e) => setFill((e.target as HTMLSelectElement).value)}
        >
          {props.columns.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function PlotEditor(props: { data: any; columns: string[] }) {
  const [show, setShow] = useState<boolean>(false);
  const [marks, setMarks] = useState<MarkOptions[]>([]);

  if (!show) {
    return (
      <div>
        <button onClick={() => setShow(true)}>Show Plot</button>
      </div>
    );
  }
  return (
    <div>
      <b>Marks</b>
      {marks.map((mark, idx) => (
        <DotForm
          columns={props.columns}
          onUpdate={(options) => {
            setMarks(marks.map((d, i) => (i === idx ? options : d)));
          }}
        />
      ))}
      <button
        onClick={() => {
          setMarks([...marks, {}]);
        }}
      >
        Add mark
      </button>
      <div>
        <strong>Preview</strong>
        <Preview data={props.data} marks={marks} />
      </div>
      <div>
        <button onClick={() => setShow(false)}>Hide</button>
      </div>
    </div>
  );
}
function Preview(props: { data: any; marks: MarkOptions[] }) {
  const target = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!target.current) return;
    const p = plot({ marks: props.marks.map((m) => dot(props.data, m)) });
    target.current.appendChild(p);
    return () => target.current.removeChild(p);
  }, [target, props.data, props.marks]);
  return <div ref={target}></div>;
}
async function main() {
  const data = (await fetch(dataUrl).then((r) => r.json())).rows as any[];
  console.log(data);

  const penguins = data;

  const p = plot({
    grid: true,
    color: { legend: true },
    marks: [
      dot(penguins, {
        x: "culmen_length_mm",
        y: "culmen_depth_mm",
        fill: "species",
      }),
      linearRegressionY(penguins, {
        x: "culmen_length_mm",
        y: "culmen_depth_mm",
        stroke: "species",
      }),
      linearRegressionY(penguins, {
        x: "culmen_length_mm",
        y: "culmen_depth_mm",
      }),
    ],
  });
  const target = document.querySelector("form");
  const root = document.createElement("div");
  target.insertAdjacentElement("afterend", root);
  const preact = root.appendChild(document.createElement("div"));

  const columns = Object.keys(data[0]);
  render(
    <div>
      <PlotEditor data={data} columns={columns} />
    </div>,
    preact
  );
  //root.appendChild(p);
}
main();
