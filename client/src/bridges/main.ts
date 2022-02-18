import {
  ipcRenderer,
  contextBridge,
  shell,
  OpenExternalOptions,
} from "electron";
import { createStoreBindings } from "electron-persist-secure/lib/bindings";
import { SettingsObject } from "../global";
import { BeatmapDetails, DownloadStatus, FilterResponse } from "../models/api";
import { Node } from "../models/filter";

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

  getSettings: async (): Promise<SettingsObject> => {
    return (await ipcRenderer.invoke("get-settings")) as SettingsObject;
  },

  setSettings: async (settings: SettingsObject): Promise<void> => {
    return (await ipcRenderer.invoke("set-settings", settings)) as void;
  },

  browse: async (): Promise<Electron.OpenDialogReturnValue> => {
    return (await ipcRenderer.invoke(
      "browse"
    )) as Electron.OpenDialogReturnValue;
  },

  loadBeatmaps: async (): Promise<number[]> => {
    return (await ipcRenderer.invoke("load-beatmaps")) as number[];
  },

  setTheme: async (theme: boolean): Promise<void> => {
    return (await ipcRenderer.invoke("set-theme", theme)) as void;
  },

  setPath: async (path: string): Promise<void> => {
    return (await ipcRenderer.invoke("set-path", path)) as void;
  },

  quit: (): void => {
    ipcRenderer.send("quit");
  },

  download: (ids: number[], size: number, force: boolean, hashes: string[], collectionName: string) => {
    ipcRenderer.invoke("download", ids, size, force, hashes, collectionName);
  },

  listenForDownloads: (callback: (status: DownloadStatus) => void) => {
    ipcRenderer.on("download-status", (event, status: DownloadStatus) => {
      callback(status);
    });
  },
};

contextBridge.exposeInMainWorld("electron", electronBridge);

export const storeBridge = createStoreBindings("config"); // "config" = the stores name

contextBridge.exposeInMainWorld("store", {
  ...storeBridge,
});
