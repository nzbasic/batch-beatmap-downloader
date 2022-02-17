import { DownloadStatus } from './../../models/api';
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { Node } from '../../models/filter'
import axios from 'axios'
import { BeatmapDetails, FilterResponse } from "../../models/api";
import settings from 'electron-settings'
import { SettingsObject } from "../../global";
import fs from 'fs'
import Download from 'nodejs-file-downloader'
import { window } from '../../main'

const serverUri = "http://192.168.1.233:7373"

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
  // save the download request to store in case of app closing
  const status: DownloadStatus = {
    all: ids,
    completed: [],
    failed: [],
    skipped: [],
    currentProgress: "0",
    currentSize: "0",
    totalSize: size,
    totalProgress: 0,
    force: force
  }
  await setDownloadStatus(status)

  const path = (await settings.get('path')) as string + "/Songs"
  const beatmapIds = await loadBeatmaps()

  for (const id of ids) {
    if (!beatmapIds.includes(id) || force) {
      const uri = `${serverUri}/beatmapset/${id}`
      let currentSize = 0
      const download = new Download({
        url: uri,
        directory: path,
        maxAttempts: 3,
        onProgress: (percentage) => {
          status.currentProgress = percentage
          window.webContents.send("download-status", status)
        },
        onResponse: (response) => {
          currentSize = parseInt(response.headers['content-length'])
          status.currentSize = response.headers["content-length"]
          window.webContents.send("download-status", status)
        }
      })

      try {
        await download.download()
        status.completed.push(id)
        status.totalProgress += currentSize
      } catch (err) {
        status.failed.push(id)
        console.log(err)
      }
    } else {
      status.skipped.push(id)
    }
    window.webContents.send("download-status", status)
    setDownloadStatus(status)
  }
})

ipcMain.handle("load-beatmaps", async () => {
  return await loadBeatmaps()
})

const loadBeatmaps = async () => {
  const path = await settings.get("path") as string
  const dir = await fs.promises.readdir(path + "/Songs")

  // get number at start of each file name
  const beatmapIds = dir.map(file => {
    const number = /^\d+/.exec(file)
    return number ? parseInt(number[0]) : 0
  })

  return beatmapIds
}

const setDownloadStatus = async (status: DownloadStatus) => {
  await settings.set("status", {
    all: status.all,
    completed: status.completed,
    skipped: status.skipped,
    failed: status.failed,
    totalSize: status.totalSize,
    totalProgress: status.totalProgress,
    force: status.force
  })
}

const getDownloadStatus = async (): Promise<DownloadStatus> => {
  const all = await settings.get("status.all") as number[]
  const completed = await settings.get("status.completed") as number[]
  const skipped = await settings.get("status.skipped") as number[]
  const failed = await settings.get("status.failed") as number[]
  const totalSize = await settings.get("status.totalSize") as number
  const totalProgress = await settings.get("status.totalProgress") as number
  const force = await settings.get("status.force") as boolean

  return {
    all,
    completed,
    failed,
    skipped,
    currentProgress: "0",
    currentSize: "0",
    totalSize,
    totalProgress,
    force
  }
}

