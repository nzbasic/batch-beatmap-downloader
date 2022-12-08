import { DownloadController } from './DownloadController';
import { setDownloadStatus, unsetDownload } from './settings';
import { window } from "../../main";
import { DownloadStatus } from '../../models/api';

export const downloadMap = new Map<string, DownloadController>()

export const getDownload = (downloadId: string) => {
  return downloadMap.get(downloadId)
};

export const convertStatus = (status: DownloadStatus) => ({
  id: status.id,
  paused: status.paused,
  all: status.all.length,
  completed: status.completed.length,
  failed: status.failed.length,
  skipped: status.skipped.length,
  totalSize: status.totalSize,
  totalProgress: status.totalProgress,
  force: status.force,
  speed: status.speed
})

export const emitStatus = () => {
  const statuses = getDownloadsStatus()
  const mapped = statuses.map(convertStatus);
  window?.webContents.send("downloads-status", mapped);
};

export const createDownload = (id: string, ids: number[], size: number, force: boolean, hashes: string[], collectionName: string) => {
  downloadMap.forEach(download => {
    download.removeIds(ids)
  })

  // const toDownload = ids.filter(id => !downloadPool.has(id))
  const download = new DownloadController(id, ids, size, force, hashes)

  if (collectionName) {
    download.createCollection(collectionName)
  }

  downloadMap.set(id, download)
  setDownloadStatus(download)
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
  if (download) {
    download.pause()
    download.updateDownload('delete')
  }

  downloadMap.delete(downloadId)
  await unsetDownload(downloadId)
  emitStatus()
}
