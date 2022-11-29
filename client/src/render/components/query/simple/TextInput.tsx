import React from "react"
import { Input } from "../../util/Input";
import { TInputItemText } from "../../../../models/simple";
import { TInputItemProps } from "./InputItem";

export const TextInput: React.FC<TInputItemProps<TInputItemText>> = ({ label, value, onChange, defaultValue }) => {
  return (
    <div className="flex items-center w-full">
      <span className="min-w-[8rem] label">{label}</span>
      <Input
        className=""
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
