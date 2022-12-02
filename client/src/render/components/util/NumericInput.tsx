import classNames from "classnames";

interface NumericInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
}

export const NumericInput = ({ value, onChange, ...props }: NumericInputProps) => {
  return (
    <input
      {...props}
      type="number"
      placeholder={props.placeholder}
      className={classNames(props.className, "p-1 px-2")}
      value={value.toString()}
      onChange={(event) => onChange(event.target.valueAsNumber)}
    />
  );
};

