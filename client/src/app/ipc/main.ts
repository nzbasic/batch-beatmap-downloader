import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { Node } from '../../models/filter'
import axios from 'axios'
import { BeatmapDetails } from "../../models/api";
import settings from 'electron-settings'
import { SettingsObject } from "../../global";
import fs from 'fs'

ipcMain.handle("query", async (event, node: Node) => {
  return (await axios.post<number[]>("http://localhost:7373/filter", node)).data
})

ipcMain.handle("get-beatmap-details", async (event, node: Node) => {
  return (await axios.post<BeatmapDetails[]>("http://localhost:7373/beatmapDetails", node)).data
})

ipcMain.handle("get-settings", async () => {
  return await settings.get()
})

ipcMain.handle("set-settings", async (event, s: SettingsObject) => {
  return await settings.set(s)
})

ipcMain.handle("set-theme", async (event, theme: boolean) => {
  return await settings.set('darkMode', theme)
})

ipcMain.handle("set-path", async (event, path: string) => {
  return await settings.set('path', path)
})

ipcMain.handle("browse", async () => {
  const dialogResult = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  return dialogResult
})

ipcMain.handle("load-beatmaps", async () => {
  const path = await settings.get("path") as string
  const dir = await fs.promises.readdir(path + "/Songs")

  // get number at start of each file name
  const beatmapIds = dir.map(file => {
    const number = /^\d+/.exec(file)
    return number ? parseInt(number[0]) : 0
  })

  return beatmapIds
})

