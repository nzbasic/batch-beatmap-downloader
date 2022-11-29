import {
  ipcRenderer,
} from "electron";
import { SettingsObject } from "../global";

export const handleGetVersion = () => ipcRenderer.invoke("get-version") as Promise<string>;
export const handleGetSettings = () => ipcRenderer.invoke("get-settings") as Promise<SettingsObject>;
export const handleSetSettings = (settings: SettingsObject) => ipcRenderer.invoke("set-settings", settings);
export const handleCheckValidPath = () => ipcRenderer.invoke("check-valid-path");
export const handleLoadBeatmaps = () => ipcRenderer.invoke("load-beatmaps") as Promise<number[]>;
export const handleSetTheme = (theme: boolean) => ipcRenderer.invoke("set-theme", theme);
export const handleSetMaxConcurrentDownloads = (number: number) => ipcRenderer.invoke("set-max-concurrent-downloads", number);
export const handleSetPath = (path: string) => ipcRenderer.invoke("set-path", path) as Promise<[boolean, number]>;
export const handleSetAltPath = (path: string) => ipcRenderer.invoke("set-alt-path", path) as Promise<number>;