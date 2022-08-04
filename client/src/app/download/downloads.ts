import { DownloadController } from './DownloadController';
import { unsetDownload } from './settings';
import { window } from "../../main";

export const downloadMap = new Map<string, DownloadController>()

export const getDownload = (downloadId: string) => {
  return downloadMap.get(downloadId)
};

export const emitStatus = () => {
  const statuses = getDownloadsStatus()
  window?.webContents.send("downloads-status", statuses);
};

export const createDownload = (ids: number[], size: number, force: boolean, hashes: string[], collectionName: string) => {
  const download = new DownloadController(ids, size, force, hashes)

  if (collectionName) {
    download.createCollection(collectionName)
  }

  const id = download.getId()
  downloadMap.set(id, download)
  return download
};

export const getDownloadsStatus = () => {
  return Array.from(downloadMap.values()).map(download => download.getStatus())
}

export const pauseDownload = (downloadId: string) => {
  const download = getDownload(downloadId)
  if (download) download.pause()
}

export const pauseDownloads = () => {
  downloadMap.forEach(download => download.pause())
}

export const resumeDownload = (downloadId: string) => {
  const download = getDownload(downloadId)
  if (download) download.resume()
}

export const resumeDownloads = () => {
  downloadMap.forEach((download) => {
    download.resume()
  })
}

export const deleteDownload = async (downloadId: string) => {
  const download = getDownload(downloadId)
  if (download) download.pause()
  downloadMap.delete(downloadId)
  await unsetDownload(downloadId)
  emitStatus()
}
