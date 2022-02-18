import settings from "electron-settings"
import fs from 'fs'

export const loadBeatmaps = async () => {
  const path = await settings.get("path") as string
  const dir = await fs.promises.readdir(path + "/Songs")

  // get number at start of each file name
  const beatmapIds = dir.map(file => {
    const number = /^\d+/.exec(file)
    return number ? parseInt(number[0]) : 0
  })

  return beatmapIds
}
