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
  handleGetVersion,
  handleLoadBeatmaps,
  handleSetAltPath,
  handleSetMaxConcurrentDownloads,
  handleSetPath,
  handleSetSettings,
  handleSetTheme
} from "./settings";
import {
  handleBrowse,
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

  getVersion: handleGetVersion,
  getSettings: handleGetSettings,
  setSettings: handleSetSettings,
  checkValidPath: handleCheckValidPath,
  loadBeatmaps: handleLoadBeatmaps,
  setTheme: handleSetTheme,
  setMaxConcurrentDownloads: handleSetMaxConcurrentDownloads,
  setPath: handleSetPath,
  setAltPath: handleSetAltPath,

  startDownload: handleStartDownload,
  createDownload: handleCreateDownload,
  pauseDownload: handlePauseDownload,
  pauseDownloads: handlePauseDownloads,
  resumeDownload: handleResumeDownload,
  resumeDownloads: handleResumeDownloads,
  deleteDownload: handleDeleteDownload,
  getDownloadsStatus: handleGetDownloadsStatus,
  checkCollections: handleCheckCollections,

  listenForDownloads: handleListenForDownloads,
  listenForErrors: handleListenForErrors,
  listenForServerDown: handleListenForServerDown
};

contextBridge.exposeInMainWorld("electron", electronBridge);

export const storeBridge = createStoreBindings("config"); // "config" = the stores name

contextBridge.exposeInMainWorld("store", {
  ...storeBridge,
});
