import "./main.css";

import { h, render } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  dot,
  plot,
  linearRegressionY,
  MarkOptions,
  lineY,
  barY,
  areaY,
} from "@observablehq/plot";

import { MarkEditor, Mark } from "../components/marks";

function interestingColumns(columns: string[], sample: { [key: string]: any }) {
  let x, y;
  for (const column of columns) {
    if (column === "rowid" || column === "id") continue;
    if (typeof sample[column] === "number") {
      if (x === undefined) {
        x = column;
      } else if (y === undefined) {
        y = column;
        break;
      }
    }
  }
  if (x === undefined) columns[0];
  if (y === undefined) columns[1];
  return [x, y];
}

interface Row {
  [key: string]: string | null | number | Date;
}

function PlotEditor(props: {
  data: any;
  columns: string[];
  initialMarks?: { mark: Mark; options: MarkOptions }[];
}) {
  const init = useMemo(() => {
    const [x, y] = interestingColumns(props.columns, props.data[0]);
    return { mark: Mark.Dot, options: { x, y } } as {
      mark: Mark;
      options: MarkOptions;
    };
  }, []);
  const [marks, setMarks] = useState<{ mark: Mark; options: MarkOptions }[]>(
    props.initialMarks ?? [init]
  );

  function onAdddMark() {
    let x, y;
    if (marks.length) {
      // @ts-ignore TODO: x/y dont exist in MarkOptions
      x = marks[marks.length - 1].options.x;
      // @ts-ignore TODO: x/y dont exist in MarkOptions
      y = marks[marks.length - 1].options.y;
    } else {
      [x, y] = interestingColumns(props.columns, props.data[0]);
    }

    setMarks([
      ...marks,
      {
        mark: Mark.Dot,
        // @ts-ignore TODO: x/y dont exist in MarkOptions
        options: { x, y },
      },
    ]);
  }

  return (
    <div>
      <div>
        <Preview data={props.data} marks={marks} />
      </div>
      <strong>Marks</strong>
      {marks.map((mark, idx) => (
        <MarkEditor
          columns={props.columns}
          initalMark={mark.mark}
          initionalOptions={mark.options}
          onUpdate={(mark, options) => {
            setMarks(marks.map((d, i) => (i === idx ? { mark, options } : d)));
          }}
          onDelete={() => {
            setMarks(marks.filter((d, i) => i !== idx));
          }}
        />
      ))}
      <button onClick={onAdddMark}>Add new visualization mark</button>
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
      width: 800,
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
          case Mark.AreaY:
            return areaY(props.data, m.options);
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

function App(props: {
  rows: any[];
  next: string | null;
  columns: string[];
  initialMarks?: { mark: Mark; options: MarkOptions }[];
}) {
  const { rows, next, columns, initialMarks } = props;
  const [show, setShow] = useState<boolean>(props.initialMarks !== null);
  if (!show) {
    return (
      <div>
        <button onClick={() => setShow(true)}>Show Plot</button>
      </div>
    );
  }

  return (
    <div className="datasette-plot">
      <button onClick={() => setShow(false)}>Hide Plot</button>
      <PlotEditor data={rows} columns={columns} initialMarks={initialMarks} />
      {next !== null ? (
        <div>Warning: not all table rows returned, only {rows.length} rows</div>
      ) : null}
    </div>
  );
}

interface DatasetteJsonResponse {
  rows: { [key: string]: null | string | number }[];
  ok: boolean;
  next: string | null;
  truncated: boolean;
}

export async function main() {
  const dataUrl = new URL(
    window.location.origin +
      window.location.pathname +
      ".json" +
      window.location.search
  );
  if (!dataUrl.searchParams.has("_size")) {
    dataUrl.searchParams.set("_size", "max");
  }

  const data = (await fetch(dataUrl).then((r) =>
    r.json()
  )) as DatasetteJsonResponse;
  const columns = Object.keys(data.rows[0]);

  // for now, any column named "date" should be converted to JS dates.
  const rows: Row[] = data.rows.slice();
  for (const column of columns) {
    if (column.toLowerCase() == "date") {
      for (const row of rows) {
        row[column] = new Date(row[column]);
      }
    }
  }

  const target =
    document.querySelector("form.sql") ||
    document.querySelector("form.filters");
  const root = target.insertAdjacentElement(
    "afterend",
    document.createElement("div")
  );

  const url = new URL(window.location.href);
  const initialMarks = url.searchParams.has("_plot-mark")
    ? url.searchParams.getAll("_plot-mark").map((d) => JSON.parse(d))
    : null;
  render(
    <App
      initialMarks={initialMarks}
      rows={rows}
      columns={columns}
      next={data.next}
    />,
    root
  );
}

document.addEventListener("DOMContentLoaded", main);
