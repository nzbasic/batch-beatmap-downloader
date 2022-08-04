import { ipcMain } from "electron";
import { download, getDownloadStatus } from "../download";

ipcMain.handle("get-download-status", async () => {
  return await getDownloadStatus()
})

export let isPaused = true
ipcMain.handle(
  "download",
  async (event, ids: number[], size: number, force: boolean, hashes: string[], collectionName: string) => {
    isPaused = false
    return await download(ids, size, force, hashes, collectionName);
  }
);

ipcMain.handle("is-download-paused", () => {
  return isPaused;
})

export const pauseDownload = () => { isPaused = true }
ipcMain.on("pause-download", (event) => {
  pauseDownload()
  event.returnValue = isPaused
})

ipcMain.handle("resume-download", async () => {
  const status = await getDownloadStatus()
  const ids = status.all.filter(id => !status.completed.includes(id))
  const size = status.totalSize - status.totalProgress
  const force = status.force
  const hashes = []
  const collectionName = ""
  isPaused = false
  download(ids, size, force, hashes, collectionName, status)
  return
})
