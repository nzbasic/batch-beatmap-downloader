import Select from "react-select";
import { inputOptions, Rule, defaultValuesMap, defaultOperatorsMap } from "../../../models/rules";

interface PropTypes {
  rule: Rule;
  onChange: (rule: Rule) => void;
}

export const RuleSelector = ({ rule, onChange }: PropTypes) => {

  return (
    <Select
      className="w-52 my-react-select-container"
      classNamePrefix="my-react-select"
      options={inputOptions}
      defaultValue={inputOptions.find((i) => i.value === rule.field)}
      onChange={(option) =>
        onChange({
          field: option.value,
          type: option.type,
          value: defaultValuesMap.get(option.type),
          operator: defaultOperatorsMap.get(option.type),
        })
      }
    />
  );
};
