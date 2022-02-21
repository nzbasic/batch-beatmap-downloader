import settings from "electron-settings";
import { DownloadStatus } from "../models/api";
import { loadBeatmaps } from "./beatmaps";
import Download from "nodejs-file-downloader";
import { window } from "../main";
import { isPaused, serverUri } from "./ipc/main";
import { addCollection } from "./collection/collection";
import { getSongsFolder } from "./settings";
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export const download = async (ids: number[], size: number, force: boolean, hashes: string[], collectionName: string, progress?: DownloadStatus) => {
  const downloadId = uuidv4()
  await axios.post(`${serverUri}/metrics/downloadStart`, { downloadId, ids, size, force })

  if (collectionName) {
    await addCollection(hashes, collectionName)
  }

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
    force: force,
  };

  if (progress) {
    status.totalProgress = progress.totalProgress
    status.totalSize = progress.totalSize
    status.completed = progress.completed
    status.skipped = progress.skipped
    status.failed = progress.failed
    status.all = progress.all
  }
  await setDownloadStatus(status);

  const path = await getSongsFolder()
  const beatmapIds = await loadBeatmaps();
  const updateLimiter = 1000000
  const newIds = ids.filter(id => {
    return !status.completed.includes(id) && !status.skipped.includes(id) && !status.failed.includes(id)
  })

  for (const id of newIds) {
    if (isPaused) {
      await axios.post(`${serverUri}/metrics/downloadEnd`, { downloadId })
      return
    }
    if (!beatmapIds.includes(id) || force) {
      const uri = `${serverUri}/beatmapset/${id}`;
      let currentSize = 0;
      let currentUpdateLimiterValue = 0
      const download = new Download({
        url: uri,
        directory: path,
        maxAttempts: 3,
        onProgress: (percentage) => {
          status.currentProgress = percentage;
          window.webContents.send("download-status", status);
        },
        onResponse: (response) => {
          currentSize = parseInt(response.headers["content-length"]);
          status.currentSize = response.headers["content-length"];
          currentUpdateLimiterValue++
          if (currentUpdateLimiterValue >= updateLimiter) {
            currentUpdateLimiterValue = 0
            window.webContents.send("download-status", status);
          }
        },
      });

      try {
        const before = new Date()
        await download.download();
        const after = new Date()
        const difference = after.getTime() - before.getTime()
        await axios.post(`${serverUri}/metrics/beatmapDownload`, { downloadId, id, size: currentSize, time: difference })
        status.completed.push(id);
        status.totalProgress += currentSize;
      } catch (err) {
        status.failed.push(id);
        console.log(err);
      }
    } else {
      status.skipped.push(id);
    }
    window.webContents.send("download-status", status);
    setDownloadStatus(status);
  }

  await axios.post(`${serverUri}/metrics/downloadEnd`, { downloadId })
};

const setDownloadStatus = async (status: DownloadStatus) => {
  await settings.set("status", {
    all: status.all,
    completed: status.completed,
    skipped: status.skipped,
    failed: status.failed,
    totalSize: status.totalSize,
    totalProgress: status.totalProgress,
    force: status.force,
  });
};

export const getDownloadStatus = async (): Promise<DownloadStatus> => {
  const all = (await settings.get("status.all")) as number[];
  const completed = (await settings.get("status.completed")) as number[];
  const skipped = (await settings.get("status.skipped")) as number[];
  const failed = (await settings.get("status.failed")) as number[];
  const totalSize = (await settings.get("status.totalSize")) as number;
  const totalProgress = (await settings.get("status.totalProgress")) as number;
  const force = (await settings.get("status.force")) as boolean;

  return {
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
