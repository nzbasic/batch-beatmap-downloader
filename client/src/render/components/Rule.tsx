import { useEffect, useState } from 'react'
import Select from 'react-select'
import { RuleType } from '../../models/filter'
import { RuleInput } from './RuleInput'
import { RuleOperator } from './RuleOperator'
import { RuleSelector } from './RuleSelector'

export interface Rule {
  type: RuleType;
  value: string;
  operator: string;
  field: string;
}

interface PropTypes {
  rule: Rule;
  id: string;
  updateParent: (rule: Rule, id: string) => void
}

export const Rule = ({ rule, id, updateParent }: PropTypes) => {
  const [state, setState] = useState<Rule>(rule)

  useEffect(() => {
    updateParent(state, id)
  }, [state])

  return (
    <div className="flex flex-row items-center gap-2">
      <RuleSelector rule={state} onChange={(rule) => setState(rule)} />
      <RuleOperator rule={state} onChange={(rule) => setState(rule)} />
      <RuleInput rule={state} onChange={(rule) => setState(rule)} />
    </div>
  )
}
