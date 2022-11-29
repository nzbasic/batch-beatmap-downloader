import React from "react"
import { TInputItemSwitch } from "../../../../models/simple";
import { TInputItemProps } from "./InputItem";
import Button from "../../util/Button";
import classNames from "classnames"

export const SwitchInput: React.FC<TInputItemProps<TInputItemSwitch>> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center w-full">
      <span className="min-w-[8rem] label">{label}</span>
      <div className="flex items-center gap-2">
        <SwitchButton
          text="Yes"
          onChange={onChange}
          target={true}
          value={value}
        />
        <SwitchButton
          text="No"
          onChange={onChange}
          target={false}
          value={value}
        />
      </div>
    </div>
  );
};

const SwitchButton = ({ text, onChange, target, value }: {
  text: string;
  onChange: (bool: boolean | undefined) => void;
  target: boolean;
  value: boolean | undefined;
}) => {
  return (
    <Button
      onClick={() => onChange(value === target ? undefined : target)}
      color="none"
      className={classNames(
        { 'bg-blue-300 dark:bg-blue-400 hover:bg-blue-500 dark:hover:bg-blue-600': value === undefined || value !== target},
        { 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-500': value === target },
    )}>
      {text}
    </Button>
  );
};
