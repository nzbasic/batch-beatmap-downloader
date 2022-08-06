export enum InputType {
  TEXT = "text",
  MIN_MAX = "minmax",
  SLIDER = "slider",
  DROPDOWN = "dropdown"
}

export type TInputItemBase = {
  key: string;
  label: string;
  required?: boolean;
};

export type TInputItemText = TInputItemBase & {
  type: InputType.TEXT;
  defaultValue?: string;
};

export type TInputItemDropdown = TInputItemBase & {
  type: InputType.DROPDOWN;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
};

export type TInputItemMinMax = TInputItemBase & {
  type: InputType.MIN_MAX;
  min: number;
  max: number;
  step: number
  defaultValue?: number[]
}

export type TInputItem = TInputItemText | TInputItemDropdown | TInputItemMinMax;
