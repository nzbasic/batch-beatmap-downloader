import { app, dialog, ipcMain } from "electron";
import { Node } from '../../models/filter'
import axios from 'axios'
import { BeatmapDetails, FilterResponse } from "../../models/api";
import settings from 'electron-settings'
import { SettingsObject } from "../../global";
import { download } from '../download';
import { loadBeatmaps } from '../beatmaps';

export const serverUri = "https://api.nzbasic.com"

ipcMain.handle("query", async (event, node: Node, limit: number) => {
  return (await axios.post<FilterResponse>(`${serverUri}/filter`, { node, limit })).data
})

ipcMain.handle("get-beatmap-details", async (event, node: Node) => {
  return (await axios.post<BeatmapDetails[]>(`${serverUri}/beatmapDetails`, node)).data
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

ipcMain.on("quit", () => {
  app.quit()
})

ipcMain.handle("download", async (event, ids: number[], size: number, force: boolean) => {
  return await download(ids, size, force)
})

ipcMain.handle("load-beatmaps", async () => {
  return await loadBeatmaps()
})




