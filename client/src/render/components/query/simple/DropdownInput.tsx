import React from "react"
import Select from "react-select";
import { TInputItemDropdown } from "../../../../models/simple";
import { TInputItemProps } from "./InputItem";
import WarningIcon from '@mui/icons-material/Warning'

export const DropdownInput: React.FC<TInputItemProps<TInputItemDropdown>> = ({ label, value, onChange, defaultValue, options, warning }) => {
  return (
    <div className="flex items-center w-full">
      <span className="min-w-[8rem] label">{label}</span>
      <Select
        className="w-40 my-react-select-container"
        classNamePrefix="my-react-select"
        options={options}
        value={value.option}
        onChange={(e) => onChange(e ? { ...value, option: e } : defaultValue)}
      />

      {warning && value.option.value === defaultValue.option.value && (
        <div className="flex gap-2 ml-4 text-orange-500">
          <WarningIcon />
          {warning}
        </div>
      )}
    </div>
  )
}
