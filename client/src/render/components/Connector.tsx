export interface ConnectorDetails {
  type: string;
  not: boolean;
}

const types = ["AND", "OR"];

interface PropTypes {
  details: ConnectorDetails
  update: (connector: ConnectorDetails) => void
}

export const Connector = ({ details, update }: PropTypes) => {
  return (
    <div className="flex items-center py-2">
      <div className="">
        {types.map((type, index) => (
          <button
            className={`
              ${index === 0 ? 'rounded-l border-r-0' : index === types.length-1 ? 'rounded-r border-l-0' : ''}
              ${details.type === type ? 'bg-blue-500' : 'bg-white hover:bg-blue-500'}
              px-2 py-1  border-gray-600 border w-12 transition duration-200`}
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
          ${details.not ? 'bg-red-500' : 'hover:bg-red-500 bg-red-200'}
          ml-2 border-gray-600 border px-2 py-1 rounded transition duration-100`}
        onClick={() => update({ ...details, not: !details.not })}
        >
          NOT
        </button>
    </div>
  )
}
