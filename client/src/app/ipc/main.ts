import { app, dialog, ipcMain } from "electron";
import { Node } from "../../models/filter";
import axios from "axios";
import { BeatmapDetails, FilterResponse } from "../../models/api";
import settings from "electron-settings";
import { SettingsObject } from "../../global";
import { download, getDownloadStatus } from "../download";
import { loadBeatmaps } from "../beatmaps";
import { window } from '../../main'
import fs from 'fs'
import { Metrics } from "../../models/metrics";
import { checkCollections } from "../collection/collection";

export const serverUri = "https://api.nzbasic.com";

ipcMain.on("quit", () => {
  app.quit();
});
