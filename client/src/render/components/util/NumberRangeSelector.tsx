import React, { useEffect, useState } from "react";
import Button from "./Button";
import classNames from 'classnames'

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
        <Button
          color="blue"
          className={classNames(
            { '!bg-emerald-600 pointer-events-none': initial === i },
            "px-0 py-0 w-6 h-6"
          )}
          key={i}
          onClick={() => handleClick(i)}
        >
          {i}
        </Button>
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
