import { app, ipcMain } from "electron";

export const serverUri = "https://api.nzbasic.com";

ipcMain.on("quit", () => {
  app.quit();
});
