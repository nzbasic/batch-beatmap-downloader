import { SettingType } from './../../models/settings';
import settings from "electron-settings";
import { SettingsObject } from "../../global";
import { window } from '../../main'
import { dialog } from "electron";
import { beatmapIds, loadBeatmaps } from "../beatmaps";
import { checkCollections } from "../collection/collection";
import { E } from "./main";
import { checkValidPath, checkValidTempPath, getTempPath } from "../settings";
import fs from 'fs';
import os from 'os';

export const handleGetSettings = async () => {
  await loadBeatmaps();
  const data = await settings.get();
  const path = data['path'] as string;
  const validPath = await checkValidPath(path);
  return { ...data, validPath, sets: beatmapIds.size };
}

export const handleSetSettings = (event: E, s: SettingsObject) => settings.set(s);
export const handleSetSetting = async <T extends keyof SettingType>(event: E, key: T, value: Parameters<SettingType[T]>[0]) => {
  switch(key) {
    case "darkMode":
      return settings.set("darkMode", value);
    case "maxConcurrentDownloads":
      return settings.set("maxConcurrentDownloads", value);
    case "path":
      return await handleSetPath(value as string);
    case "altPath":
      return await handleSetAltPath(value as string);
    case "altPathEnabled":
      return await handleSetAltPathEnabled(value as boolean);
    case "temp":
      return settings.set("temp", value);
    case "tempPath":
      return settings.set("tempPath", value);
    case "autoTemp":
      return settings.set("autoTemp", value);
  }
}

export const handleLoadBeatmaps = loadBeatmaps;
export const handleCheckCollections = checkCollections

export const handleSetPath = async (path: string) => {
  const validPath = await checkValidPath(path);

  if (!validPath) {
    window?.webContents.send("error", "Could not find collection.db");
    return [false, 0];
  }

  const backupName = `${path}/collection-bbd-backup.db`
  const f = await fs.promises.open(backupName, 'w', 0o666);
  await fs.promises.copyFile(path + '/collection.db', backupName)
  f.close();

  await settings.set("path", path);
  await loadBeatmaps();

  return [true, beatmapIds.size]
}

export const handleSetAltPath = async (path: string): Promise<number> => {
  await settings.set("altPath", path);
  await loadBeatmaps();
  return beatmapIds.size
}

export const handleSetAltPathEnabled = async (enabled: boolean) => {
  await settings.set("altPathEnabled", enabled);
  await loadBeatmaps();
  return beatmapIds.size;
}

export const handleBrowse = async () => {
  const dialogResult = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return dialogResult;
}


export const handleResetTempPath = () => settings.unset("tempPath");
export const handleGetTempData = async () => {
  const tempEnabled = await settings.get("temp") as boolean;
  const tempAuto = await settings.get("autoTemp") as boolean
  const tempPath = await getTempPath();
  const files = tempPath ? await fs.promises.readdir(tempPath) : []
  const valid = await checkValidTempPath(tempPath);

  return {
    valid,
    enabled: tempEnabled ?? false,
    path: tempPath,
    count: files.filter(file => file.endsWith(".osz")).length,
    auto: tempAuto ?? false
  };
};

export const handleGetPlatform = () => os.platform();
