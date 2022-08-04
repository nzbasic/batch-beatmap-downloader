import { app, dialog, ipcMain } from "electron";
import { loadBeatmaps } from "../beatmaps";
import { checkCollections } from "../collection/collection";
import { window } from '../../main'
import settings from "electron-settings";
import fs from 'fs';
import { SettingsObject } from "../../global";

ipcMain.handle("get-version", () => {
  return app.getVersion();
})

ipcMain.handle("get-settings", async () => {
  return await settings.get();
});

ipcMain.handle("set-settings", async (event, s: SettingsObject) => {
  return await settings.set(s);
});

ipcMain.handle("set-theme", async (event, theme: boolean) => {
  return await settings.set("darkMode", theme);
});

ipcMain.handle("set-max-concurrent-downloads", async (event, number: number) => {
  return await settings.set("maxConcurrentDownloads", number);
})

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


ipcMain.handle("load-beatmaps", async () => {
  return await loadBeatmaps();
});

ipcMain.handle("check-collections", async () => {
  return await checkCollections()
})
