import { dialog, app, ipcMain } from "electron";
import settings from "electron-settings";
import { createDownload, deleteDownload, getDownloadsStatus, resumeDownload, resumeDownloads, pauseDownloads, pauseDownload as pause } from './../download/downloads';
import { download, getDownloadStatus } from "../download";
import { loadBeatmaps } from "../beatmaps";
import { checkCollections } from "../collection/collection";
import { window } from '../../main'
import fs from 'fs';
import { SettingsObject } from "../../global";
import axios from "axios";
import { Node } from "../../models/filter";
import { BeatmapDetails, FilterResponse } from "../../models/api";
import { Metrics } from "../../models/metrics";
import { loadDownloads } from "../download/settings";

export const serverUri = "https://api.nzbasic.com";

loadDownloads()

ipcMain.on("quit", () => {
  app.quit();
});

ipcMain.handle("get-download-status", async () => {
  return await getDownloadStatus()
})

ipcMain.handle("create-download", (event, ids: number[], size: number, force: boolean, hashes: string[], collectionName: string) => {
  const download = createDownload(ids, size, force, hashes, collectionName)
  download.resume()
});

ipcMain.handle("get-downloads-status", () => {
  return getDownloadsStatus()
});

ipcMain.handle("resume-download2", (event, downloadId: string) => {
  return resumeDownload(downloadId)
});

ipcMain.handle("resume-downloads", () => {
  return resumeDownloads();
});

ipcMain.handle("pause-download2", (event, downloadId: string) => {
  return pause(downloadId)
})

ipcMain.handle("pause-downloads", () => {
  return pauseDownloads()
})

ipcMain.handle("delete-download", (event, downloadId: string) => {
  deleteDownload(downloadId)
});

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

ipcMain.handle("get-version", () => {
  return app.getVersion();
})

ipcMain.handle("get-settings", async () => {
  return await settings.get();
});

ipcMain.handle("set-settings", async (event, s: SettingsObject) => {
  return await settings.set(s);
});

ipcMain.handle("set-theme", async (event, theme: boolean) => {
  return await settings.set("darkMode", theme);
});

ipcMain.handle("set-max-concurrent-downloads", async (event, number: number) => {
  return await settings.set("maxConcurrentDownloads", number);
})

ipcMain.handle("set-alt-path", async (event, path: string) => {
  return await settings.set("altPath", path);
});

ipcMain.handle("set-path", async (event, path: string): Promise<boolean> => {
  try {
    const files = await fs.promises.readdir(path);
    if (!files.includes("collection.db")) {
      window?.webContents.send("error", "Could not find collection.db");
      return false;
    }
  } catch(err) {
    window?.webContents.send("error", "Could not find collection.db");
    return false;
  }

  await settings.set("path", path);
  return true
});

ipcMain.handle("browse", async () => {
  const dialogResult = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return dialogResult;
});


ipcMain.handle("load-beatmaps", async () => {
  return await loadBeatmaps();
});

ipcMain.handle("check-collections", async () => {
  return await checkCollections()
})

ipcMain.handle("query", async (event, node: Node, limit: number) => {
  return (
    await axios.post<FilterResponse>(`${serverUri}/filter`, { node, limit })
  ).data;
});

ipcMain.handle("get-metrics", async () => {
  try {
    const res = await axios.get<Metrics>(`${serverUri}/metrics`);
    if (res.status !== 200) {
      return [false, null]
    } else {
      return [true, res.data]
    }
  } catch(err) {
    return [false, null]
  }
})

ipcMain.handle("get-beatmap-details", async (event, node: Node) => {
  return (
    await axios.post<BeatmapDetails[]>(`${serverUri}/beatmapDetails`, node)
  ).data;
});
