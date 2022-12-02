import settings from "electron-settings";
import { SettingsObject } from "../../global";
import { window } from '../../main'
import { dialog } from "electron";
import { beatmapIds, loadBeatmaps } from "../beatmaps";
import { checkCollections } from "../collection/collection";
import { E } from "./main";
import { checkValidPath } from "../settings";
import fs from 'fs';

export const handleGetSettings = async () => {
  await loadBeatmaps();
  const data = await settings.get();
  const path = data['path'] as string;
  const validPath = await checkValidPath(path);
  return { ...data, validPath, sets: beatmapIds.size };
}

export const handleSetSettings = (event: E, s: SettingsObject) => settings.set(s);
export const handleSetTheme = (event: E, theme: boolean) => settings.set("darkMode", theme);
export const handleSetMaxConcurrentDownloads = (event: E, number: number) => settings.set("maxConcurrentDownloads", number);

export const handleLoadBeatmaps = loadBeatmaps;
export const handleCheckCollections = checkCollections

export const handleSetPath = async (event: E, path: string): Promise<[boolean, number]> => {
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

export const handleSetAltPath = async (event: E, path: string): Promise<number> => {
  await settings.set("altPath", path);
  await loadBeatmaps();
  return beatmapIds.size
}

export const handleBrowse = async () => {
  const dialogResult = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return dialogResult;
}
