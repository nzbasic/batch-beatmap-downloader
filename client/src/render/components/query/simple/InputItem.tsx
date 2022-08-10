import React, { ComponentProps } from "react";
import { InputType, TInputItem } from "../../../../models/simple";
import { MinMaxInput } from "./MinMaxInput";
import { SliderInput } from "./SliderInput";
import { TextInput } from "./TextInput";

export type TInputItemProps<ExactFormItem extends TInputItem> = {
  value: NonNullable<ExactFormItem["defaultValue"]>;
  onChange: (value: NonNullable<ExactFormItem["defaultValue"]>) => void;
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
  }

  return <div>Input</div>
};

export default InputItem
