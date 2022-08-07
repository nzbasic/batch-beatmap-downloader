import React from "react"
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';
import { Input } from "../../util/Input";
import is_number from "is-number";
import { TInputItemMinMax } from "../../../types/input";
import { TInputItemProps } from "./InputItem";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const createSliderWithTooltip = Slider.createSliderWithTooltip;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const Range = createSliderWithTooltip(Slider.Range);

export const MinMaxInput: React.FC<TInputItemProps<TInputItemMinMax>> = ({ label, value, onChange, min, max, step }) => {
  const updateValue = (newValue: string, index: number) => {
    // todo handle x.
    if (is_number(newValue)) {
      const number = parseFloat(newValue)
      if (number > max || number < min) return
      const newValues = [number, value[1-index]]
      if (index === 1) newValues.reverse()
      onChange(newValues)
    }
  }

  return (
    <div className="flex items-center w-full gap-4">
      <span className="w-32">{label}</span>
      <div className="w-16">
        <Input
          className="p-1"
          value={value[0].toString()}
          onChange={(value) => updateValue(value, 0)}
        />
      </div>
      <Range
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
      <div className="w-16">
        <Input
          className="p-1"
          value={value[1].toString()}
          onChange={(value) => updateValue(value, 1)}
        />
      </div>
    </div>
  )
}
