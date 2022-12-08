import { createDownload, downloadMap } from './downloads';
import settings from "electron-settings";
import { DownloadStatus } from "../../models/api";
import { v4 as uuid } from 'uuid';
import { DownloadController } from './DownloadController';

export let clientId: string

const downloadToStatus = (download: DownloadController) => {
  const status = download.getStatus()
  const id = download.getId()

  return {
    id,
    all: status.all,
    completed: status.completed,
    skipped: status.skipped,
    failed: status.failed,
    totalSize: status.totalSize,
    totalProgress: status.totalProgress,
    force: status.force,
  }
}

export const setDownloadStatus = async (download: DownloadController) => {
  const status = downloadToStatus(download)
  await settings.set(`downloads.${status.id}.status`, status);
};

export const setAllDownloadStatus = async () => {
  const downloads = Array.from(downloadMap.values());
  for (const download of downloads) {
    await setDownloadStatus(download)
  }
}

export const getDownloadStatus = async (downloadId: string): Promise<DownloadStatus> => {
  const all = (await settings.get(`downloads.${downloadId}.status.all`)) as number[];
  const completed = (await settings.get(`downloads.${downloadId}.status.completed`)) as number[];
  const skipped = (await settings.get(`downloads.${downloadId}.status.skipped`)) as number[];
  const failed = (await settings.get(`downloads.${downloadId}.status.failed`)) as number[];
  const totalSize = (await settings.get(`downloads.${downloadId}.status.totalSize`)) as number;
  const totalProgress = (await settings.get(`downloads.${downloadId}.status.totalProgress`)) as number;
  const force = (await settings.get(`downloads.${downloadId}.status.force`)) as boolean;

  return {
    id: downloadId,
    all,
    completed,
    failed,
    skipped,
    totalSize,
    totalProgress,
    force,
    speed: 0
  };
};

export const loadClientId = async () => {
  clientId = await settings.get("clientId") as string
  if (!clientId) {
    const newClientId = uuid()
    await settings.set("clientId", newClientId)
    clientId = newClientId
  }
}

export const loadDownloads = async () => {
  const storedDownloads: unknown = await settings.get("downloads");
  if (typeof storedDownloads !== "object") return;
  if (storedDownloads === null) return;
  const downloads = storedDownloads as { [key: string]: { status: DownloadStatus } };

  if (downloads) {
    const keys = Object.keys(downloads);

    for (const key of keys) {
      const download = downloads[key].status;
      if (download.all === undefined || download.completed === undefined || download.failed === undefined || download.skipped === undefined) {
        console.log('bad download', download.id)
        continue;
      }

      const remaining = download.all.length - download.completed.length - download.failed.length - download.skipped.length
      if (remaining === 0) {
        unsetDownload(key)
        continue;
      }

      const ids = download.all;
      const size = download.totalSize;
      const force = download.force
      const hashes = [] as string[];
      const collectionName = ""
      const dl = createDownload(key, ids, size, force, hashes, collectionName)
      dl.setStatus({
        ...dl.getStatus(),
        completed: download.completed,
        failed: download.failed,
        skipped: download.skipped,
        totalProgress: download.totalProgress
      })
    }
  }
};

export const unsetDownload = (downloadId: string) => {
  return settings.unset(`downloads.${downloadId}`);
}
