import { createDownload } from './downloads';
import settings from "electron-settings";
import { DownloadStatus } from "../../models/api";

export const setDownloadStatus = async (downloadId: string, status: DownloadStatus) => {
  await settings.set(`downloads.${downloadId}.status`, {
    id: downloadId,
    all: status.all,
    completed: status.completed,
    skipped: status.skipped,
    failed: status.failed,
    totalSize: status.totalSize,
    totalProgress: status.totalProgress,
    force: status.force,
  });
};

export const getDownloadStatus = async (downloadId: string): Promise<DownloadStatus> => {
  const all = (await settings.get(`downloads.${downloadId}.status.all`)) as number[];
  const completed = (await settings.get(`downloads.${downloadId}.completed`)) as number[];
  const skipped = (await settings.get(`downloads.${downloadId}.skipped`)) as number[];
  const failed = (await settings.get(`downloads.${downloadId}.failed`)) as number[];
  const totalSize = (await settings.get(`downloads.${downloadId}.totalSize`)) as number;
  const totalProgress = (await settings.get(`downloads.${downloadId}.totalProgress`)) as number;
  const force = (await settings.get(`downloads.${downloadId}.force`)) as boolean;

  return {
    id: downloadId,
    all,
    completed,
    failed,
    skipped,
    currentProgress: "0",
    currentSize: "0",
    totalSize,
    totalProgress,
    force,
  };
};

export const loadDownloads = async () => {
  const downloads = await settings.get("downloads");
  if (downloads) {
    const keys = Object.keys(downloads);

    for (const key of keys) {
      const download: DownloadStatus = downloads[key] as DownloadStatus;
      if (!download?.all || !download?.completed || !download?.skipped || !download?.failed) continue
      const remaining = download.all.filter((id) => {
        return !download.completed.includes(id) ||
          !download.skipped.includes(id) ||
          !download.failed.includes(id);
      });

      if (remaining.length === 0) {
        await settings.unset(`downloads.${key}`);
      }

      const ids = download.all.filter(id => !download.completed.includes(id))
      const size = download.totalSize - download.totalProgress
      const force = download.force
      const hashes = []
      const collectionName = ""
      createDownload(ids, size, force, hashes, collectionName)
    }
  }
};

export const unsetDownload = (downloadId: string) => {
  return settings.unset(`downloads.${downloadId}`);
}
