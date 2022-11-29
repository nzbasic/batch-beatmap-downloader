import { app, ipcMain } from "electron";
import { loadClientId, loadDownloads } from "../download/settings";
import {
  handleCreateDownload,
  handleDeleteDownload,
  handleGetDownloadsStatus,
  handlePauseDownload,
  handlePauseDownloads,
  handleResumeDownload,
  handleResumeDownloads,
  handleStartDownload
} from "./downloads";
import {
  handleBrowse,
  handleCheckCollections,
  handleGetSettings,
  handleLoadBeatmaps,
  handleSetAltPath,
  handleSetMaxConcurrentDownloads,
  handleSetPath,
  handleSetSettings,
  handleSetTheme
} from "./settings";
import { handleGetBeatmapDetails, handleGetMetrics, handleQuery } from "./query";

export const serverUri = "https://api.nzbasic.com";
export type E = Electron.IpcMainInvokeEvent

loadDownloads()
loadClientId()

ipcMain.on("quit", () => app.quit());
ipcMain.handle("get-version", () => app.getVersion())

ipcMain.handle("start-download", handleStartDownload)
ipcMain.handle("get-downloads-status", handleGetDownloadsStatus)
ipcMain.handle("create-download", handleCreateDownload);
ipcMain.handle("resume-download", handleResumeDownload);
ipcMain.handle("resume-downloads", handleResumeDownloads);
ipcMain.handle("pause-download", handlePauseDownload);
ipcMain.handle("pause-downloads", handlePauseDownloads)
ipcMain.handle("delete-download", handleDeleteDownload);

ipcMain.handle("get-settings", handleGetSettings);
ipcMain.handle("set-settings", handleSetSettings);
ipcMain.handle("set-theme", handleSetTheme);
ipcMain.handle("set-max-concurrent-downloads", handleSetMaxConcurrentDownloads)
ipcMain.handle("set-alt-path", handleSetAltPath);
ipcMain.handle("set-path", handleSetPath);
ipcMain.handle("browse", handleBrowse);
ipcMain.handle("load-beatmaps", handleLoadBeatmaps);
ipcMain.handle("check-collections", handleCheckCollections)

ipcMain.handle("query", handleQuery);
ipcMain.handle("get-metrics", handleGetMetrics)
ipcMain.handle("get-beatmap-details", handleGetBeatmapDetails);
