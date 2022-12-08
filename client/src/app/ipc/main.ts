import { app, ipcMain } from "electron";
import { loadClientId, loadDownloads } from "../download/settings";
import {
  handleCreateDownload,
  handleDeleteDownload,
  handleGetDownloadsStatus,
  handleMoveAllDownloads,
  handlePauseDownload,
  handlePauseDownloads,
  handleResumeDownload,
  handleResumeDownloads,
  handleStartDownload
} from "./downloads";
import {
  handleBrowse,
  handleCheckCollections,
  handleGetPlatform,
  handleGetSettings,
  handleGetTempData,
  handleLoadBeatmaps,
  handleResetTempPath,
  handleSetAltPath,
  handleSetAltPathEnabled,
  handleSetMaxConcurrentDownloads,
  handleSetPath,
  handleSetSettings,
  handleSetTempEnabled,
  handleSetTempPath,
  handleSetTheme
} from "./settings";
import { handleGetBeatmapDetails, handleGetMetrics, handleQuery } from "./query";

export const serverUri = "http://localhost:7373";
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
ipcMain.handle("move-all-downloads", handleMoveAllDownloads);

ipcMain.handle("get-settings", handleGetSettings);
ipcMain.handle("set-settings", handleSetSettings);
ipcMain.handle("set-theme", handleSetTheme);
ipcMain.handle("set-max-concurrent-downloads", handleSetMaxConcurrentDownloads)
ipcMain.handle("set-alt-path", handleSetAltPath);
ipcMain.handle("set-path", handleSetPath);
ipcMain.handle("browse", handleBrowse);
ipcMain.handle("load-beatmaps", handleLoadBeatmaps);
ipcMain.handle("check-collections", handleCheckCollections)
ipcMain.handle("set-temp-enabled", handleSetTempEnabled);
ipcMain.handle("set-temp-path", handleSetTempPath);
ipcMain.handle("reset-temp-path", handleResetTempPath);
ipcMain.handle("get-temp-data", handleGetTempData);
ipcMain.handle("get-platform", handleGetPlatform);
ipcMain.handle("set-alt-path-enabled", handleSetAltPathEnabled);

ipcMain.handle("query", handleQuery);
ipcMain.handle("get-metrics", handleGetMetrics)
ipcMain.handle("get-beatmap-details", handleGetBeatmapDetails);
