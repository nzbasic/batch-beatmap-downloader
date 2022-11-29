import {
  ipcRenderer,
} from "electron";
import { DownloadStatus, MissingMaps, ReportedDownloadStatus } from "../models/api";

export const handleStartDownload = (force: boolean, collectionName: string) => {
  return ipcRenderer.invoke("start-download", force, collectionName) as Promise<void>
}

export const handleCreateDownload = (ids: number[], size: number, force: boolean, hashes: string[], collectionName: string) => {
  return ipcRenderer.invoke("create-download", ids, size, force, hashes, collectionName) as Promise<void>
};

export const handlePauseDownload = (downloadId: string) => {
  return ipcRenderer.invoke("pause-download", downloadId) as Promise<void>
};

export const handleCheckCollections = () => {
  return ipcRenderer.invoke("check-collections") as Promise<MissingMaps>
}

export const handleGetDownloadsStatus = () => {
  return ipcRenderer.invoke("get-downloads-status") as Promise<ReportedDownloadStatus[]>;
};

export const handleResumeDownloads = () => {
  return ipcRenderer.invoke("resume-downloads") as Promise<void>
};

export const handleResumeDownload = (downloadId: string) => {
  return ipcRenderer.invoke("resume-download", downloadId) as Promise<void>
};

export const handlePauseDownloads = () => {
  return ipcRenderer.invoke("pause-downloads") as Promise<void>
};

export const handleDeleteDownload = (downloadId: string) => {
  return ipcRenderer.invoke("delete-download", downloadId) as Promise<void>
};

export const handleListenForDownloads = (callback: (downloads: ReportedDownloadStatus[]) => void) => {
  ipcRenderer.on("downloads-status", (event, downloads: ReportedDownloadStatus[]) => {
    callback(downloads)
  })
};
