import {
  ipcRenderer,
  contextBridge,
  shell,
  OpenExternalOptions,
} from "electron";
import { createStoreBindings } from "electron-persist-secure/lib/bindings";
import { SettingsObject } from "../global";
import { BeatmapDetails, DownloadStatus, FilterResponse, MissingMaps } from "../models/api";
import { Node } from "../models/filter";
import { Metrics } from "../models/metrics";

const handleGenericError = (e: unknown) => {
  if (typeof e === "string") {
    return e;
  } else if (e instanceof Error) {
    return e.message;
  }
};

export const electronBridge = {
  query: async (node: Node, limit: number) => {
    try {
      const res = (await ipcRenderer.invoke(
        "query",
        node,
        limit
      )) as FilterResponse;
      return res;
    } catch (e) {
      return handleGenericError(e);
    }
  },

  getMetrics: async (): Promise<[boolean, Metrics]> => {
    return (await ipcRenderer.invoke("get-metrics") as [boolean, Metrics])
  },

  getBeatmapDetails: async (ids: number[]) => {
    try {
      const res = (await ipcRenderer.invoke(
        "get-beatmap-details",
        ids
      )) as BeatmapDetails[];
      return res;
    } catch (e) {
      return handleGenericError(e);
    }
  },

  openUrl: async (
    url: string,
    options?: OpenExternalOptions
  ): Promise<void> => {
    return await shell.openExternal(url, options);
  },

  getVersion: async (): Promise<string> => {
    return (await ipcRenderer.invoke("get-version")) as string
  },

  getSettings: async (): Promise<SettingsObject> => {
    return (await ipcRenderer.invoke("get-settings")) as SettingsObject;
  },

  setSettings: async (settings: SettingsObject) => {
    await ipcRenderer.invoke("set-settings", settings)
  },

  browse: async (): Promise<Electron.OpenDialogReturnValue> => {
    return (await ipcRenderer.invoke(
      "browse"
    )) as Electron.OpenDialogReturnValue;
  },

  checkValidPath: async () => {
    await ipcRenderer.invoke("check-valid-path")
  },

  loadBeatmaps: async (): Promise<number[]> => {
    return (await ipcRenderer.invoke("load-beatmaps")) as number[];
  },

  setTheme: async (theme: boolean) => {
    await ipcRenderer.invoke("set-theme", theme)
  },

  setPath: async (path: string): Promise<boolean> => {
    return (await ipcRenderer.invoke("set-path", path)) as boolean;
  },

  setAltPath: async (path: string) => {
    await ipcRenderer.invoke("set-alt-path", path)
  },

  quit: (): void => {
    ipcRenderer.send("quit");
  },

  download: async (ids: number[], size: number, force: boolean, hashes: string[], collectionName: string) => {
    await ipcRenderer.invoke("download", ids, size, force, hashes, collectionName)
  },

  pauseDownload: () => {
    ipcRenderer.sendSync("pause-download")
  },

  resumeDownload: async () => {
    await ipcRenderer.invoke("resume-download")
  },

  isDownloadPaused: async (): Promise<boolean> => {
    return await ipcRenderer.invoke("is-download-paused") as boolean;
  },

  getDownloadStatus: async (): Promise<DownloadStatus> => {
    return (await ipcRenderer.invoke("get-download-status")) as DownloadStatus;
  },

  checkCollections: async (): Promise<MissingMaps> => {
    return (await ipcRenderer.invoke("check-collections") as MissingMaps)
  },

  listenForDownloads: (callback: (status: DownloadStatus) => void) => {
    ipcRenderer.on("download-status", (event, status: DownloadStatus) => {
      callback(status);
    });
  },

  listenForErrors: (callback: (error: string) => void) => {
    ipcRenderer.on("error", (event, error: string) => {
      callback(error);
    });
  },

  listenForServerDown: (callback: (down: boolean) => void) => {
    ipcRenderer.on("server-down", (event, down: boolean) => {
      callback(down);
    });
  }
};

contextBridge.exposeInMainWorld("electron", electronBridge);

export const storeBridge = createStoreBindings("config"); // "config" = the stores name

contextBridge.exposeInMainWorld("store", {
  ...storeBridge,
});
