import React, { ComponentProps } from "react";
import { InputType, TInputItem } from "../../../../models/simple";
import { SliderInput } from "./SliderInput";

export type TInputItemProps<ExactFormItem extends TInputItem> = {
  value: NonNullable<ExactFormItem["defaultValue"]>;
  onChange: (value: NonNullable<ExactFormItem["defaultValue"]>) => void;
} & ExactFormItem;

const InputItem: React.FC<TInputItemProps<TInputItem>> = (props) => {
  const type = props.type as InputType;

  switch (type) {
    case InputType.SLIDER:
      return <SliderInput {...props as ComponentProps<typeof SliderInput>} />
  }

  return <div>Input</div>
};

export default InputItem
