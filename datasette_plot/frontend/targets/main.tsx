import { h, render } from "preact";
import { useEffect, useId, useMemo, useRef, useState } from "preact/hooks";
import {
  dot,
  dotX,
  plot,
  PlotOptions,
  linearRegressionY,
  MarkOptions,
  DotOptions,
  BarOptions,
  AreaOptions,
  AreaYOptions,
  BarYOptions,
  LineYOptions,
  LinearRegressionYOptions,
  lineY,
  barY,
} from "@observablehq/plot";

const dataUrl =
  window.location.origin +
  window.location.pathname +
  ".json" +
  window.location.search;

function ColumnSelect(props: {
  title: string;
  columns: string[];
  value: string;
  setValue: (v: string) => void;
}) {
  const { title, columns, value, setValue } = props;
  return (
    <div>
      <div style="display: grid; grid-template-columns: 60px auto;">
        <div>
          <span>{title}</span>
        </div>
        <div>
          <select
            value={value}
            onChange={(e) => setValue((e.target as HTMLSelectElement).value)}
          >
            {columns.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function DotEditor(props: {
  columns: string[];
  onUpdate: (options: DotOptions) => void;
  options: DotOptions;
}) {
  const [x, setX] = useState<string>(props.options.x as string);
  const [y, setY] = useState<string>(props.options.y as string);
  const [fill, setFill] = useState<string | null>(props.options.fill as string);
  useEffect(() => {
    props.onUpdate({ x, y, fill, tip: true });
  }, [x, y, fill]);
  const id = useId();
  const name = `fill-${id}`;
  return (
    <div>
      <ColumnSelect
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ColumnSelect
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
      <ColumnSelect
        title="Fill"
        value={fill}
        setValue={setFill}
        columns={props.columns}
      />
      <input name={name} id={`${name}-column`} type="radio" />
      <label for={`${name}-column`}>Column</label>

      <input name={name} id={`${name}-value`} type="radio" />
      <label for={`${name}-column`}>Value</label>
    </div>
  );
}
function AreaEditor(props: {
  columns: string[];
  onUpdate: (options: AreaYOptions) => void;
  options: AreaYOptions;
}) {
  const [x, setX] = useState<string>(props.options.x as string);
  const [y, setY] = useState<string>(props.options.y as string);
  const [fill, setFill] = useState<string | null>(props.options.fill as string);
  useEffect(() => {
    props.onUpdate({ x, y, fill, tip: true });
  }, [x, y, fill]);
  return (
    <div>
      <ColumnSelect
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ColumnSelect
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
      <ColumnSelect
        title="Fill"
        value={fill}
        setValue={setFill}
        columns={props.columns}
      />
    </div>
  );
}
function BarEditor(props: {
  columns: string[];
  onUpdate: (options: BarYOptions) => void;
  options: BarYOptions;
}) {
  const [x, setX] = useState<string>(props.options.x as string);
  const [y, setY] = useState<string>(props.options.y as string);
  useEffect(() => {
    props.onUpdate({ x, y, tip: true });
  }, [x, y]);
  return (
    <div>
      <ColumnSelect
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ColumnSelect
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
    </div>
  );
}
function LineEditor(props: {
  columns: string[];
  onUpdate: (options: DotOptions) => void;
  options: LineYOptions;
}) {
  const [x, setX] = useState<string>(props.options.x as string);
  const [y, setY] = useState<string>(props.options.y as string);
  const [stroke, setStroke] = useState<string>(props.options.stroke as string);
  useEffect(() => {
    props.onUpdate({ x, y, tip: true });
  }, [x, y]);
  return (
    <div>
      <ColumnSelect
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ColumnSelect
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
      <ColumnSelect
        title="Stroke"
        value={stroke}
        setValue={setStroke}
        columns={props.columns}
      />
    </div>
  );
}
function LinearRegressionYEditor(props: {
  columns: string[];
  onUpdate: (options: LinearRegressionYOptions) => void;
  options: LinearRegressionYOptions;
}) {
  const [x, setX] = useState<string>(props.options.x as string);
  const [y, setY] = useState<string>(props.options.y as string);
  const [stroke, setStroke] = useState<string>(props.options.stroke as string);
  useEffect(() => {
    props.onUpdate({ x, y, stroke, tip: true });
  }, [x, y, stroke]);
  return (
    <div>
      <ColumnSelect
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ColumnSelect
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
      <ColumnSelect
        title="Stroke"
        value={stroke}
        setValue={setStroke}
        columns={props.columns}
      />
    </div>
  );
}

enum Mark {
  Dot = "dot",
  LinearRegressionY = "linear-regression-y",
  BarY = "bar-y",
  AreaY = "area-y",
  LineY = "line-y",
}

function MarkEditor(props: {
  columns: string[];
  initalMark: Mark;
  initionalOptions: MarkOptions;
  onUpdate: (m: Mark, o: MarkOptions) => void;
}) {
  let [mark, setMark] = useState<Mark>(props.initalMark);
  let [options, setOptions] = useState<MarkOptions>(props.initionalOptions);

  useEffect(() => {
    props.onUpdate(mark, options);
  }, [mark, options]);

  function render() {
    switch (mark) {
      case Mark.Dot:
        return (
          <DotEditor
            columns={props.columns}
            onUpdate={setOptions}
            options={options}
          />
        );
      case Mark.LinearRegressionY:
        return (
          <LinearRegressionYEditor
            columns={props.columns}
            onUpdate={setOptions}
            options={options}
          />
        );
      case Mark.AreaY:
        return (
          <AreaEditor
            columns={props.columns}
            onUpdate={setOptions}
            options={options}
          />
        );
      case Mark.BarY:
        return (
          <BarEditor
            columns={props.columns}
            onUpdate={setOptions}
            options={options}
          />
        );
      case Mark.LineY:
        return (
          <LinearRegressionYEditor
            columns={props.columns}
            onUpdate={setOptions}
            options={options}
          />
        );
    }
  }
  return (
    <div style="border: 1px solid black;">
      <div style="">
        Mark type:{" "}
        <select
          value={mark}
          onChange={(e) =>
            setMark((e.target as HTMLSelectElement).value as Mark)
          }
        >
          <option value={Mark.Dot}>Dot</option>
          <option value={Mark.LinearRegressionY}>Linear Regression (y)</option>
          <option value={Mark.BarY}>Bar (y)</option>
          <option value={Mark.AreaY}>Area (y)</option>
          <option value={Mark.LineY}>Line (y)</option>
        </select>
      </div>
      <div style="padding: .5rem 1rem;">{render()}</div>
    </div>
  );
}

function PlotEditor(props: {
  data: any;
  columns: string[];
  initalMarks?: { mark: Mark; options: MarkOptions }[];
}) {
  const [show, setShow] = useState<boolean>(props.initalMarks !== null);
  const [marks, setMarks] = useState<{ mark: Mark; options: MarkOptions }[]>(
    props.initalMarks ?? []
  );

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
        <MarkEditor
          columns={props.columns}
          initalMark={mark.mark}
          initionalOptions={mark.options}
          onUpdate={(mark, options) => {
            setMarks(marks.map((d, i) => (i === idx ? { mark, options } : d)));
          }}
        />
      ))}
      <button
        onClick={() => {
          setMarks([
            ...marks,
            {
              mark: Mark.Dot,
              // @ts-ignore TODO: x/y dont exist in MarkOptions
              options: { x: props.columns[0], y: props.columns[1] },
            },
          ]);
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
function Preview(props: {
  data: any;
  marks: { mark: Mark; options: MarkOptions }[];
}) {
  const target = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!target.current) return;
    const p = plot({
      color: { legend: true },

      marks: props.marks.map((m) => {
        switch (m.mark) {
          case Mark.Dot:
            return dot(props.data, m.options);
          case Mark.LinearRegressionY:
            return linearRegressionY(props.data, m.options);
          case Mark.LineY:
            return lineY(props.data, m.options);
          case Mark.BarY:
            return barY(props.data, m.options);
        }
      }),
    });

    target.current.appendChild(p);
    return () => target.current.removeChild(p);
  }, [target, props.data, props.marks]);

  const url = (() => {
    const baseUrl = new URL(window.location.href);
    baseUrl.searchParams.delete("_plot-mark");
    for (const mark of props.marks) {
      baseUrl.searchParams.append("_plot-mark", JSON.stringify(mark));
    }
    return baseUrl.toString();
  })();

  return (
    <div>
      <div ref={target}></div>
      <a href={url}>Link to this plot</a>
    </div>
  );
}
async function main() {
  const data = (await fetch(dataUrl).then((r) => r.json())).rows as any[];
  const target = document.querySelector("form.sql");
  const root = target.insertAdjacentElement(
    "afterend",
    document.createElement("div")
  );

  const columns = Object.keys(data[0]);

  const url = new URL(window.location.href);
  const initalMarks = url.searchParams.has("_plot-mark")
    ? url.searchParams.getAll("_plot-mark").map((d) => JSON.parse(d))
    : null;
  render(
    <div className="datasette-plot">
      <PlotEditor data={data} columns={columns} initalMarks={initalMarks} />
    </div>,
    root
  );
  //root.appendChild(p);
}
main();
