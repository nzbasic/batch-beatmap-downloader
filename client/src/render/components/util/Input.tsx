import React from "react"

interface PropTypes {
  className?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
}

export const Input: React.FC<PropTypes> = ({
  className = "",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  required = false
}) => {
  return (
    <input
      type="text"
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      required={required}
    />
  )
}
