import React, { ComponentProps } from "react";
import { InputType, TInputItem } from "../../../types/input";
import { MinMaxInput } from "./MinMaxInput";

export type TInputItemProps<ExactFormItem extends TInputItem> = {
  value: NonNullable<ExactFormItem["defaultValue"]>;
  onChange: (value: NonNullable<ExactFormItem["defaultValue"]>) => void;
} & ExactFormItem;

const InputItem: React.FC<TInputItemProps<TInputItem>> = (props) => {
  const type = props.type as InputType;

  switch (type) {
    case InputType.MIN_MAX:
      return <MinMaxInput {...props as ComponentProps<typeof MinMaxInput>} />
  }

  return <div>Input</div>
};

export default InputItem
