import { h } from "preact";
import { useEffect, useId, useState } from "preact/hooks";
import {
  MarkOptions,
  DotOptions,
  AreaYOptions,
  BarYOptions,
  LineYOptions,
  LinearRegressionYOptions,
  lineY,
  barY,
} from "@observablehq/plot";

function ChanelValueSelector(props: {
  required: boolean;
  title: string;
  columns: string[];
  value: string | undefined;
  setValue: (v: string | undefined) => void;
}) {
  const { title, columns, value, setValue, required } = props;
  const [show, setShow] = useState<boolean>(
    props.required || value !== undefined
  );

  useEffect(() => {
    if (!show && !value) setValue(undefined);
  }, [show, value]);

  return (
    <div className="channel-value-selector">
      <div
        className={"title-bar " + (!required ? "toggleable" : "")}
        onClick={!show ? () => setShow((d) => !d) : null}
      >
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div className="dp-title">{title}</div>
          <div>
            {(show || required) && (
              <select
                value={value}
                onChange={(e) =>
                  setValue((e.target as HTMLSelectElement).value)
                }
              >
                {columns.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div
          onClick={() => {
            if (!required) setShow((d) => !d);
            // hiding this should remove any value
            if (show) {
              setValue(undefined);
            }
          }}
          style={{
            marginLeft: ".5rem",
            color: required ? "rgba(0,0,0,0)" : "",
          }}
        >
          {required ? "-" : show ? "-" : "+"}
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
  const [fill, setFill] = useState<string | undefined>(
    props.options.fill as string | undefined
  );
  const [stroke, setStroke] = useState<string | undefined>(
    props.options.stroke as string | undefined
  );
  useEffect(() => {
    props.onUpdate({ x, y, fill, stroke });
  }, [x, y, fill, stroke]);

  const id = useId();

  return (
    <div>
      <ChanelValueSelector
        required={true}
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={true}
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={false}
        title="Fill"
        value={fill}
        setValue={setFill}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={false}
        title="Stroke"
        value={stroke}
        setValue={setStroke}
        columns={props.columns}
      />
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
      <ChanelValueSelector
        required={true}
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={true}
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={false}
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
  const [fill, setFill] = useState<string>(props.options.fill as string);
  useEffect(() => {
    props.onUpdate({ x, y, fill, tip: true });
  }, [x, y, fill]);
  return (
    <div>
      <ChanelValueSelector
        required={true}
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={true}
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={false}
        title="Fill"
        value={fill}
        setValue={setFill}
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
      <ChanelValueSelector
        required={true}
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={true}
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={false}
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
      <ChanelValueSelector
        required={true}
        title="X"
        value={x}
        setValue={setX}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={true}
        title="Y"
        value={y}
        setValue={setY}
        columns={props.columns}
      />
      <ChanelValueSelector
        required={false}
        title="Stroke"
        value={stroke}
        setValue={setStroke}
        columns={props.columns}
      />
    </div>
  );
}

export const enum Mark {
  Dot = "dot",
  LinearRegressionY = "linear-regression-y",
  BarY = "bar-y",
  AreaY = "area-y",
  LineY = "line-y",
}

export function MarkEditor(props: {
  columns: string[];
  initalMark: Mark;
  initionalOptions: MarkOptions;
  onUpdate: (m: Mark, o: MarkOptions) => void;
  onDelete: () => void;
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
    <div className="mark-editor">
      <div className="mark-editor-header">
        <div>
          <select
            value={mark}
            onChange={(e) =>
              setMark((e.target as HTMLSelectElement).value as Mark)
            }
          >
            <option value={Mark.Dot}>Dot</option>
            <option value={Mark.LinearRegressionY}>
              Linear Regression (y)
            </option>
            <option value={Mark.BarY}>Bar (y)</option>
            <option value={Mark.AreaY}>Area (y)</option>
            <option value={Mark.LineY}>Line (y)</option>
          </select>
        </div>
        <div>
          <button className="delete-mark" onClick={props.onDelete}>
            Delete mark
          </button>
        </div>
      </div>
      <div>{render()}</div>
    </div>
  );
}
