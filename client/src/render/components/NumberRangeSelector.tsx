import { useEffect, useState } from "react";

interface PropTypes {
  min: number;
  max: number;
  initial: number;
  onChange: (i: number) => void;
}

export const NumberRangeSelector = ({ min, max, initial, onChange }: PropTypes) => {
  const [buttons, setButtons] = useState<React.FC[]>()

  const handleClick = (i: number) => {
    onChange(i)
  }

  useEffect(() => {
    const buttons = []
    for (let i = min; i <= max; i++) {
      buttons.push(
        <button
          className={`w-6 h-6 rounded-sm transition-colors font-semibold
            ${initial == i ? 'bg-emerald-600 ' : 'bg-blue-400 hover:bg-blue-600'}
          `}
          disabled={initial == i}
          key={i}
          onClick={() => handleClick(i)}
        >
          {i}
        </button>
      )
    }

    setButtons(buttons)
  }, [initial])

  return (
    <div className="flex items-center gap-2">
      {buttons}
    </div>
  )
}
