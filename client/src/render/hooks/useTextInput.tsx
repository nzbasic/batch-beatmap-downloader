import React, { useState } from 'react';
import classNames from 'classnames';

interface UseTextInputArguments {
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  initialValue?: string
  required?: boolean
}

export const useTextInput = (args: UseTextInputArguments = {}): [JSX.Element, string] => {
  const {
    label = '',
    placeholder = '',
    className = '',
    disabled = false,
    initialValue = '',
    required = false
  } = args;
  const [value, setValue] = useState(initialValue);

  const TextInput = (
    <div className="flex items-center w-full gap-2">
      {label && <label className="w-32">{label}</label>}
      <input
        type="text"
        className={classNames('input', className)}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        required={required}
      />
    </div>
  );

  return [TextInput, value];
};
