import { useEffect, useState } from "react";
import { RuleInput } from "./RuleInput";
import { RuleOperator } from "./RuleOperator";
import { RuleSelector } from "./RuleSelector";
import { Rule } from "../../../models/rules";

interface PropTypes {
  rule: Rule;
  id: string;
  updateParent: (rule: Rule, id: string) => void;
}

export const FilterRule = ({ rule, id, updateParent }: PropTypes) => {
  const [state, setState] = useState<Rule>(rule);

  useEffect(() => {
    updateParent(state, id);
  }, [state]);

  return (
    <div className="flex flex-row items-center gap-2">
      <RuleSelector rule={state} onChange={(rule) => setState(rule)} />
      <RuleOperator rule={state} onChange={(rule) => setState(rule)} />
      <RuleInput rule={state} onChange={(rule) => setState(rule)} />
    </div>
  );
};
