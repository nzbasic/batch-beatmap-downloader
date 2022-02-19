import { app, dialog, ipcMain } from "electron";
import { Node } from "../../models/filter";
import axios from "axios";
import { BeatmapDetails, FilterResponse } from "../../models/api";
import settings from "electron-settings";
import { SettingsObject } from "../../global";
import { download } from "../download";
import { loadBeatmaps } from "../beatmaps";
import { window } from '../../main'
import fs from 'fs'

export const serverUri = "https://api.nzbasic.com";

ipcMain.handle("query", async (event, node: Node, limit: number) => {
  return (
    await axios.post<FilterResponse>(`${serverUri}/filter`, { node, limit })
  ).data;
});

ipcMain.handle("get-beatmap-details", async (event, node: Node) => {
  return (
    await axios.post<BeatmapDetails[]>(`${serverUri}/beatmapDetails`, node)
  ).data;
});

ipcMain.handle("get-settings", async () => {
  return await settings.get();
});

ipcMain.handle("set-settings", async (event, s: SettingsObject) => {
  return await settings.set(s);
});

ipcMain.handle("set-theme", async (event, theme: boolean) => {
  return await settings.set("darkMode", theme);
});

ipcMain.handle("set-alt-path", async (event, path: string) => {
  return await settings.set("altPath", path);
});

ipcMain.handle("set-path", async (event, path: string): Promise<boolean> => {
  try {
    const files = await fs.promises.readdir(path);
    if (!files.includes("collection.db")) {
      window.webContents.send("error", "Could not find collection.db");
      return false;
    }
  } catch(err) {
    window.webContents.send("error", "Could not find collection.db");
    return false;
  }

  await settings.set("path", path);
  return true
});

ipcMain.handle("browse", async () => {
  const dialogResult = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return dialogResult;
});

ipcMain.on("quit", () => {
  app.quit();
});

ipcMain.handle(
  "download",
  async (event, ids: number[], size: number, force: boolean, hashes: string[], collectionName: string) => {
    return await download(ids, size, force, hashes, collectionName);
  }
);

ipcMain.handle("load-beatmaps", async () => {
  return await loadBeatmaps();
});
