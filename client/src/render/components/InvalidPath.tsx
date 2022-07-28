import React from "react"

export const InvalidPath = () => {
  return (
    <div className="bg-white dark:bg-monokai-dark rounded shadow p-6 flex flex-col dark:text-white w-full">
      <span className="font-bold text-lg">Please set a valid osu! path above to use this app.</span>
    </div>
  )
}
