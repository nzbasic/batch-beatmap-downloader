import React, { useEffect, useState } from "react";

interface PropTypes {
  min: number;
  max: number;
  initial: number;
  onChange: (i: number) => void;
}

export const NumberRangeSelector = ({ min, max, initial, onChange }: PropTypes) => {
  const [buttons, setButtons] = useState<JSX.Element[]>()

  const handleClick = (i: number) => {
    onChange(i)
  }

  useEffect(() => {
    const buttons: JSX.Element[] = []
    for (let i = min; i <= max; i++) {
      buttons.push(
        <button
          className={
            `${initial == i ? 'bg-emerald-600 ' : 'button'}
            w-6 h-6 rounded-sm transition-colors font-semibold text-white`
          }
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
