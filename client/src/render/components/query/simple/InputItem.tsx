import React, { ComponentProps } from "react";
import { InputType, TInputItem } from "../../../../models/simple";
import { DropdownInput } from "./DropdownInput";
import { MinMaxInput } from "./MinMaxInput";
import { SliderInput } from "./SliderInput";
import { TextInput } from "./TextInput";
import { SwitchInput } from "./SwitchInput";

export type TInputItemProps<ExactFormItem extends TInputItem> = {
  value: Exclude<ExactFormItem["defaultValue"], null>;
  onChange: (value: Exclude<ExactFormItem["defaultValue"], null>) => void;
} & ExactFormItem;

const InputItem: React.FC<TInputItemProps<TInputItem>> = (props) => {
  const type = props.type as InputType;

  switch (type) {
    case InputType.SLIDER:
      return <SliderInput {...props as ComponentProps<typeof SliderInput>} />
    case InputType.TEXT:
      return <TextInput {...props as ComponentProps<typeof TextInput>} />
    case InputType.MIN_MAX:
      return <MinMaxInput {...props as ComponentProps<typeof MinMaxInput>} />
    case InputType.DROPDOWN:
      return <DropdownInput {...props as ComponentProps<typeof DropdownInput>} />
    case InputType.SWITCH:
      return <SwitchInput {...props as ComponentProps<typeof SwitchInput>} />
  }

  return <div>Unknown Input</div>
};

export default InputItem
