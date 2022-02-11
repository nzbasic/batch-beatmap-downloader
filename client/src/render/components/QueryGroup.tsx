import { Rule } from './Rule';
import { Group } from '../pages/Home'
import { Connector, ConnectorDetails } from './Connector';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RuleType } from '../../models/filter';
import { cloneDeep } from 'lodash'
import { Node } from '../pages/Home'
import ClearIcon from '@mui/icons-material/Clear';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface PropTypes {
  group: Group
  id: string
  updateParent: (group: Group, id: string) => void
}

const defaultRule = {
  id: uuidv4(),
  rule: {
    type: RuleType.STATUS,
    value: "ranked",
    operator: "=",
    field: "Approved"
  }
}

const defaultGroup = {
  id: uuidv4(),
  group: {
    connector: {
      type: "AND",
      not: false
    },
    children: [cloneDeep(defaultRule)]
  }
}

export const QueryGroup = ({ group, id, updateParent }: PropTypes) => {
  const [state, setState] = useState<Group>(group)

  useEffect(() => {
    updateParent(state, id)
  }, [state])

  const updateGroup = (child: Group | Rule, id: string) => {
    setState({
      ...state,
      children: state.children.map(node => {
        if (node.id === id) {
          if ("children" in child) {
            return { ...node, group: child }
          } else {
            return { ...node, rule: child }
          }
        }
        return node
      })
    })
  }

  const updateConnector = (connector: ConnectorDetails) => {
    setState({
      ...state,
      connector
    })
  }

  const addChild = (child: Node) => {
    child.id = uuidv4()
    setState({
      ...state,
      children: [...state.children, child]
    })
  }

  const removeChild = (id: string) => {
    setState({
      ...state,
      children: state.children.filter(node => node.id !== id)
    })
  }

  return (
    <div className="bg-slate-100 border-black border-l-indigo-500 border-l-8 border rounded-l-none rounded m-2 p-2 flex flex-col">
      {state.children.map((child, index) => (
        <div key={index}>
          {index == 0 ? null : <Connector details={state.connector} update={updateConnector} />}
          {child.group ?
            <div className="">
              <ClearIcon onClick={() => removeChild(child.id)} className="hover:cursor-pointer text-white rounded-full bg-red-600 h-10 w-10 mb-1" />
              <div className="-mt-6">
                <QueryGroup group={child.group} id={child.id} updateParent={(child, id) => updateGroup(child, id)} />
              </div>
            </div>
             :
            <div className="flex gap-2 items-center">
              <Rule rule={child.rule} id={child.id} updateParent={(rule, id) => updateGroup(rule, id)} />
              {(id != "root" || index != 0) && <CancelOutlinedIcon onClick={() => removeChild(child.id)} className="text-gray-400 hover:cursor-pointer hover:text-red-500" />}
            </div>
          }
        </div>
      ))}
      <div className="flex items-center gap-2 mt-4">
        <button onClick={() => addChild(cloneDeep(defaultRule))} className="bg-blue-600 text-white rounded px-2 py-1 hover:bg-blue-700 font-medium transition duration-150">+ Add Rule</button>
        <button onClick={() => addChild(cloneDeep(defaultGroup))} className="bg-blue-600 text-white rounded px-2 py-1 hover:bg-blue-700 font-medium transition duration-150">+ Add Group</button>
      </div>
    </div>
  );
};

