import settings from "electron-settings";
import { DownloadStatus } from "../models/api";
import { loadBeatmaps } from "./beatmaps";
import Download from "nodejs-file-downloader";
import { window } from "../main";
import { serverUri } from "./ipc/main";

export const download = async (ids: number[], size: number, force: boolean) => {
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
  await setDownloadStatus(status);

  const path = ((await settings.get("path")) as string) + "/Songs";
  const beatmapIds = await loadBeatmaps();

  for (const id of ids) {
    if (!beatmapIds.includes(id) || force) {
      const uri = `${serverUri}/beatmapset/${id}`;
      let currentSize = 0;
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
          window.webContents.send("download-status", status);
        },
      });

      try {
        await download.download();
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

const getDownloadStatus = async (): Promise<DownloadStatus> => {
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
