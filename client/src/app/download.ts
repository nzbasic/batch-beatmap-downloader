import settings from "electron-settings";
import { DownloadStatus } from "../models/api";
import { loadBeatmaps } from "./beatmaps";
import Download from "nodejs-file-downloader";
import { window, shouldBeClosed } from "../main";
import { isPaused, pauseDownload, serverUri } from "./ipc/main";
import { addCollection } from "./collection/collection";
import { getSongsFolder } from "./settings";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const handleServerError = (err: Error) => {
  if (err.message.includes("status code 502")) {
    window.webContents.send("error", "Server is down");
    window.webContents.send("server-down", true)
    pauseDownload()
    serverUpLoop()
  }
}

const pause = (downloadId: string) => {
  try {
    axios.post(`${serverUri}/metrics/downloadEnd`, { downloadId });
  } catch(err) {
    if (err instanceof Error) {
      handleServerError(err)
    }
  }
  return;
}

let interval: NodeJS.Timer
const serverUpLoop = () => {
  interval = setInterval(() => {
    try {
      axios.get(serverUri).then(res => {
        if (res.status === 204) {
          window.webContents.send("server-down", false)
          clearInterval(interval)
        }
      })
    } catch (err) {}
  }, 1000);
}

enum Status {
  FINISHED,
  PAUSED,
  ERROR
}

export const download = async (
  ids: number[],
  size: number,
  force: boolean,
  hashes: string[],
  collectionName: string,
  progress?: DownloadStatus
) => {
  const downloadId = uuidv4();
  try {
    await axios.post(`${serverUri}/metrics/downloadStart`, {
      downloadId,
      ids,
      size,
      force,
    });
  } catch(err) {
    if (err instanceof Error) {
      handleServerError(err)
    }
  }

  if (collectionName) {
    await addCollection(hashes, collectionName);
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
    status.totalProgress = progress.totalProgress;
    status.totalSize = progress.totalSize;
    status.completed = progress.completed;
    status.skipped = progress.skipped;
    status.failed = progress.failed;
    status.all = progress.all;
  }
  await setDownloadStatus(status);

  const path = await getSongsFolder();
  const beatmapIds = await loadBeatmaps();
  const newIds = ids.filter((id) => {
    return (
      !status.completed.includes(id) &&
      !status.skipped.includes(id) &&
      !status.failed.includes(id)
    );
  });

  const skipped: number[] = []
  const toDownload = newIds.filter(id => {
    if (force) return true;

    const hasMap = beatmapIds.includes(id)

    if (hasMap) {
      skipped.push(id)
      return false
    }

    return true
  })

  if (!status.skipped.length) {
    status.skipped = skipped
  }

  const downloadMapSet = async (): Promise<Status | (() => Promise<void>)> => {
    if (shouldBeClosed) return Status.PAUSED

    if (isPaused) {
      pause(downloadId)
      return Status.PAUSED
    }

    const id = toDownload.pop()
    if (!id) return Status.FINISHED

    const uri = `${serverUri}/beatmapset/${id}`;
    let currentSize = 0;
    let cancelled = false

    const download = new Download({
      url: uri,
      directory: path,
      maxAttempts: 3,
      onProgress: (percentage) => {
        status.currentProgress = percentage;
      },
      onResponse: (response) => {
        currentSize = parseInt(response.headers["content-length"]);
        status.currentSize = response.headers["content-length"];
        if (isPaused) download.cancel()
        cancelled = true
      },
    })

    try {
      const before = new Date();
      await download.download();
      const after = new Date();
      const difference = after.getTime() - before.getTime();

      const downloadStats: { time: number, size: number }[] = status.currentDownloads??[]
      if (downloadStats.length == maxConcurrentDownloads) {
        downloadStats.shift()
      }

      downloadStats.push({
        time: difference,
        size: currentSize
      })

      let totalDownloadSpeed = 0
      for (const downloadStat of downloadStats) {
        const size = downloadStat.size * 8 / 1000 / 1000
        const time = downloadStat.time / 1000
        totalDownloadSpeed += (size / time)
      }

      await axios.post(`${serverUri}/metrics/beatmapDownload`, {
        downloadId,
        id,
        size: currentSize,
        time: difference,
        totalDownloadSpeed
      });

      status.currentDownloads = downloadStats
      status.lastDownloadTime = difference
      status.lastDownloadSize = currentSize
      status.completed.push(id);
      status.totalProgress += currentSize;
    } catch (err) {
      if (!cancelled) {
        status.failed.push(id);
        status.totalProgress += currentSize;

        if (err instanceof Error) {
          handleServerError(err)
        }
      }
    }

    window.webContents.send("download-status", status);
    await setDownloadStatus(status);

    return downloadMapSet()
  }

  const maxConcurrentDownloads = (await settings.get("maxConcurrentDownloads"))??3
  const downloads: Promise<Status | (() => Promise<void>)>[] = []
  for (let i = 0; i < maxConcurrentDownloads; i++) {
    downloads.push(downloadMapSet())
  }

  const results = await Promise.all(downloads)

  for (const result of results) {
    if (result === Status.FINISHED) {
      // this prevents failed downloads not adding to the progress bar
      status.totalProgress = status.totalSize;
      window.webContents.send("download-status", status);
    }
  }

  await setDownloadStatus(status)

  try {
    await axios.post(`${serverUri}/metrics/downloadEnd`, { downloadId });
  } catch(err) {
    if (err instanceof Error) {
      handleServerError(err)
    }
  }
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
