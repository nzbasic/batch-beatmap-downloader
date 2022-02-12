import {
  ipcRenderer,
  contextBridge,
  shell,
  OpenExternalOptions,
} from "electron";
import { createStoreBindings } from "electron-persist-secure/lib/bindings";
import { SettingsObject } from "../global";
import { BeatmapDetails } from "../models/api";
import { Node } from '../models/filter'

export const electronBridge = {
  query: async (node: Node) => {
    const res = await ipcRenderer.invoke("query", node) as number[];
    return res;
  },

  getBeatmapDetails: async (ids: number[]) => {
    const res = await ipcRenderer.invoke("get-beatmap-details", ids) as BeatmapDetails[];
    console.log(res)
    return res;
  },

  openUrl: async (
    url: string,
    options?: OpenExternalOptions
  ): Promise<void> => {
    return await shell.openExternal(url, options);
  },

  getSettings: async (): Promise<SettingsObject> => {
    return await ipcRenderer.invoke("get-settings") as SettingsObject;
  },

  setSettings: async (settings: SettingsObject): Promise<void> => {
    return await ipcRenderer.invoke("set-settings", settings) as void;
  },

  browse: async (): Promise<Electron.OpenDialogReturnValue> => {
    return await ipcRenderer.invoke("browse") as Electron.OpenDialogReturnValue;
  },

  loadBeatmaps: async (): Promise<number[]> => {
    return await ipcRenderer.invoke("load-beatmaps") as number[];
  },

  setTheme: async (theme: boolean): Promise<void> => {
    return await ipcRenderer.invoke("set-theme", theme) as void;
  },

  setPath: async (path: string): Promise<void> => {
    return await ipcRenderer.invoke("set-path", path) as void;
  }
};

contextBridge.exposeInMainWorld("electron", electronBridge);

export const storeBridge = createStoreBindings("config"); // "config" = the stores name

contextBridge.exposeInMainWorld("store", {
  ...storeBridge,
});
