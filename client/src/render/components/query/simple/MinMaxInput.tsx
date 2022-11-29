import React from "react"
import 'rc-slider/assets/index.css';
import { Input } from "../../util/Input";
import { TInputItemProps } from "./InputItem";
import { TInputItemMinMax } from "../../../../models/simple";
import is_number from "is-number";

export const MinMaxInput: React.FC<TInputItemProps<TInputItemMinMax>> = ({ label, value, onChange }) => {
  const updateValue = (newValue: string, index: number) => {
    // todo handle x.
    if (is_number(newValue)) {
      const number = parseFloat(newValue)
      const newValues = [number, value[1-index]]
      if (index === 1) newValues.reverse()
      onChange(newValues)
    } else if (newValue === "") {
      const newValues = [...value]
      newValues[index] = -1
      onChange(newValues)
    }
  };

  return (
    <div className="flex items-center w-full">
      <span className="min-w-[8rem] label">{label}</span>
      <div className="flex items-center gap-4">
        <div className="w-16">
          <Input
            placeholder="Min"
            className="p-1 px-2"
            value={(value[0] === -1 ? "" : value[0]).toString()}
            onChange={(value) => updateValue(value, 0)}
          />
        </div>
        <div className="w-16">
          <Input
            placeholder="Max"
            className="p-1 px-2"
            value={(value[1] === -1 ? "" : value[1]).toString()}
            onChange={(value) => updateValue(value, 1)}
          />
        </div>
      </div>
    </div>
  )
}
