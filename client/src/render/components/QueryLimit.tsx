import isNumber from 'is-number'
import Switch from 'react-switch'

interface PropTypes {
  limit: number | null,
  updateLimit: (n: number | null) => void
}

const defaultLimit = 10

export const QueryLimit = ({ limit, updateLimit }: PropTypes) => {

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (isNumber(value)) {
      updateLimit(parseInt(value))
    }
  }

  const enable = (enabled: boolean) => {
    if (enabled) {
      updateLimit(defaultLimit)
    } else {
      updateLimit(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span>Enable Query Limit</span>
      <Switch onChange={(enabled) => enable(enabled)} checked={limit !== null} />
      {limit &&
        <input
          className="input-height p-2 w-40 border-gray-300 border rounded focus:outline-blue-500"
          type="number"
          value={limit}
          onChange={e => onChange(e)}
        />
      }
    </div>
  )
}
