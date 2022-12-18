import { TempData } from "../models/ipc";
import { SettingType } from "../models/settings";
import {
  ipcRenderer,
} from "electron";
import { SettingsObject } from "../global";

export const handleSetSetting = <T extends keyof SettingType>(name: T, ...args: Parameters<SettingType[T]>): ReturnType<SettingType[T]> => {
  return ipcRenderer.invoke("set-setting", name, ...args) as ReturnType<SettingType[T]>
}

export const handleGetVersion = () => ipcRenderer.invoke("get-version") as Promise<string>;
export const handleGetSettings = () => ipcRenderer.invoke("get-settings") as Promise<SettingsObject>;
export const handleSetSettings = (settings: SettingsObject) => ipcRenderer.invoke("set-settings", settings);
export const handleCheckValidPath = () => ipcRenderer.invoke("check-valid-path");
export const handleLoadBeatmaps = () => ipcRenderer.invoke("load-beatmaps") as Promise<number[]>;
export const handleGetTempData = () => ipcRenderer.invoke("get-temp-data") as Promise<TempData>;
export const handleResetTempPath = () => ipcRenderer.invoke("reset-temp-path") as Promise<void>;
