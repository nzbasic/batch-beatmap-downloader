import { useEffect, useState } from "react"
import Switch from 'react-switch'

export const Settings = () => {
  const [path, setPath] = useState<string>("")
  const [beatmaps, setBeatmaps] = useState<number[]>([])
  const [darkMode, setDarkMode] = useState<boolean>(false)

  const updatePath = async () => {
    await window.electron.setPath(path)
    setBeatmaps(await window.electron.loadBeatmaps())
  }

  const updateTheme = async (mode: boolean) => {
    await window.electron.setTheme(mode)
    setDarkMode(mode)
    document.documentElement.classList.toggle("dark", mode)
  }

  const browse = async () => {
    const res = await window.electron.browse()
    if (!res.canceled) {
      setPath(res.filePaths[0])
    }
  }

  useEffect(() => {
    window.electron.getSettings().then(res => {
      if (res.path) {
        setPath(res.path as string)
        window.electron.loadBeatmaps().then(res => {
          setBeatmaps(res)
        })
      }

      if (res.darkMode) {
        const mode = res.darkMode as boolean
        setDarkMode(mode)
        document.documentElement.classList.toggle("dark", mode)
      }
    })
  }, [])

  return (
    <div className="bg-white dark:bg-zinc-800 rounded shadow p-6 m-4 flex flex-col dark:text-white">
      <span className="font-bold text-lg">Settings</span>
      <div className="flex flex-col gap-4">
        <div className="flex items-center mt-4 gap-2">
          <span className="w-24">osu! Path:</span>
          <input onChange={e => setPath(e.target.value)} value={path} className="input-height p-2 w-40 border-gray-300 border rounded focus:outline-blue-500" type="text" />
          <button onClick={() => browse()} className="bg-blue-600 rounded hover:bg-blue-700 transition duration-150 px-2 py-1 text-white font-medium">Browse</button>
          <button onClick={() => updatePath()} className="bg-blue-600 rounded hover:bg-blue-700 transition duration-150 px-2 py-1 text-white font-medium">Save</button>
          {beatmaps.length} Beatmap Sets Found
        </div>
        <div className="flex items-center gap-2">
          <span className="w-24">Dark Mode:</span>
          <Switch onChange={(mode) => updateTheme(mode)} checked={darkMode} />
        </div>
      </div>

    </div>
  )
}

