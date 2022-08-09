import React from "react"
import { Input } from "../../util/Input";
import { TInputItemText } from "../../../../models/simple";
import { TInputItemProps } from "./InputItem";

export const TextInput: React.FC<TInputItemProps<TInputItemText>> = ({ label, value, onChange, defaultValue }) => {
  return (
    <div className="flex items-center w-full gap-4">
      <span className="w-32">{label}</span>
      <Input
        className="p-1"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
