import { app, BrowserWindow, ipcMain } from "electron";
import { Node } from '../../models/filter'
import axios from 'axios'
import { BeatmapDetails } from "../../models/api";

ipcMain.on("quit-app", () => {
  app.quit();
});

ipcMain.on("minimize-app", () => {
  if (process.platform === "darwin") {
    app.hide();
    return;
  }
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on("maximize-app", () => {
  BrowserWindow.getFocusedWindow()?.maximize();
});

ipcMain.on("relaunch-app", () => {
  app.relaunch();
  app.exit(0);
});

ipcMain.handle("query", async (event, node: Node) => {
  return (await axios.post<number[]>("http://localhost:7373/filter", node)).data
})

ipcMain.handle("get-beatmap-details", async (event, node: Node) => {
  return (await axios.post<BeatmapDetails[]>("http://localhost:7373/beatmapDetails", node)).data
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them in main.ts.
