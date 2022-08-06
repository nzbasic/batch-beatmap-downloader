import React from "react"
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';
import { Input } from "./Input";
import is_number from "is-number";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

interface PropTypes {
  values: number[]
  onChange: (values: number[]) => void
  min: number
  max: number
  step: number
}

export const MinMaxInput: React.FC<PropTypes> = ({ values, onChange, min, max, step }) => {
  console.log(values)

  const updateValue = (value: string, index: number) => {

    // todo handle x.

    if (is_number(value)) {
      const number = parseFloat(value)
      if (number > max || number < min) return
      const newValues = [number, values[1-index]]
      if (index === 1) newValues.reverse()
      onChange(newValues)
    }
  }

  return (
    <div className="flex items-center w-full gap-4">
      <div className="w-24">
        <Input
          className="p-1"
          value={values[0].toString()}
          onChange={(value) => updateValue(value, 0)}
        />
      </div>
      <Range
        value={values}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
      <div className="w-24">
        <Input
          className="p-1"
          value={values[1].toString()}
          onChange={(value) => updateValue(value, 1)}
        />
      </div>
    </div>
  )
}
