import { ConnectorDetails } from "../../models/filter";

const types = ["AND", "OR"];

interface PropTypes {
  details: ConnectorDetails
  update: (connector: ConnectorDetails) => void
}

export const Connector = ({ details, update }: PropTypes) => {
  return (
    <div className="flex items-center py-2 text-black dark:text-white">
      <div className="">
        {types.map((type, index) => (
          <button
            className={`
              ${index === 0 ? 'rounded-l border-r-0' : index === types.length-1 ? 'rounded-r border-l-0' : ''}
              ${details.type === type ? 'bg-blue-500 dark:bg-blue-500' : 'bg-white dark:bg-monokai-light2 dark:hover:bg-blue-500 hover:bg-blue-500'}
              px-2 py-1 border-gray-600 dark:border-monokai-border border w-12 transition duration-200`}
            disabled={type === details.type}
            onClick={() => update({ ...details, type })}
            key={index}
          >
            {type}
          </button>
        ))}
      </div>

      <button
        className={`
          ${details.not ? 'bg-red-500 dark:bg-red-600' : 'hover:bg-red-500 bg-white dark:bg-monokai-light2 dark:hover:bg-red-600'}
          ml-2 border-gray-600 dark:border-monokai-border border px-2 py-1 rounded transition duration-100`}
        onClick={() => update({ ...details, not: !details.not })}
        >
          NOT
        </button>
    </div>
  )
}
