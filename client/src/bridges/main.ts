import {
  contextBridge,
} from "electron";
import { createStoreBindings } from "electron-persist-secure/lib/bindings";
import {
  handleCheckCollections,
  handleCreateDownload,
  handleDeleteDownload,
  handleGetDownloadsStatus,
  handleListenForDownloads,
  handleMoveAllDownloads,
  handlePauseDownload,
  handlePauseDownloads,
  handleResumeDownload,
  handleResumeDownloads,
  handleStartDownload
} from "./downloads";
import { handleGetBeatmapDetails, handleGetMetrics, handleQuery } from "./query";
import {
  handleCheckValidPath,
  handleGetSettings,
  handleGetTempData,
  handleGetVersion,
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
import {
  handleBrowse,
  handleGetPlatform,
  handleListenForErrors,
  handleListenForServerDown,
  handleOpenUrl,
  handleQuit
} from "./system";

export const handleGenericError = (e: unknown) => {
  if (typeof e === "string") {
    return e;
  } else if (e instanceof Error) {
    return e.message;
  }
};

export const electronBridge = {
  query: handleQuery,
  getMetrics: handleGetMetrics,
  getBeatmapDetails: handleGetBeatmapDetails,

  openUrl: handleOpenUrl,
  browse: handleBrowse,
  quit: handleQuit,
  getPlatform: handleGetPlatform,

  getVersion: handleGetVersion,
  getSettings: handleGetSettings,
  setSettings: handleSetSettings,
  checkValidPath: handleCheckValidPath,
  loadBeatmaps: handleLoadBeatmaps,
  setTheme: handleSetTheme,
  setMaxConcurrentDownloads: handleSetMaxConcurrentDownloads,
  setPath: handleSetPath,
  setAltPath: handleSetAltPath,
  setAltPathEnabled: handleSetAltPathEnabled,

  startDownload: handleStartDownload,
  createDownload: handleCreateDownload,
  pauseDownload: handlePauseDownload,
  pauseDownloads: handlePauseDownloads,
  resumeDownload: handleResumeDownload,
  resumeDownloads: handleResumeDownloads,
  deleteDownload: handleDeleteDownload,
  getDownloadsStatus: handleGetDownloadsStatus,
  checkCollections: handleCheckCollections,
  getTempData: handleGetTempData,
  setTempEnabled: handleSetTempEnabled,
  setTempPath: handleSetTempPath,
  resetTempPath: handleResetTempPath,
  moveTempDownloads: handleMoveAllDownloads,

  listenForDownloads: handleListenForDownloads,
  listenForErrors: handleListenForErrors,
  listenForServerDown: handleListenForServerDown
};

contextBridge.exposeInMainWorld("electron", electronBridge);

export const storeBridge = createStoreBindings("config"); // "config" = the stores name

contextBridge.exposeInMainWorld("store", {
  ...storeBridge,
});
