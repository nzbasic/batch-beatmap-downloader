import axios from "axios";
import { app, dialog, ipcMain } from "electron";
import { Node } from "../../models/filter";
import { BeatmapDetails, FilterResponse } from "../../models/api";
import { serverUri } from "./main";
import { Metrics } from "../../models/metrics";

ipcMain.handle("query", async (event, node: Node, limit: number) => {
  return (
    await axios.post<FilterResponse>(`${serverUri}/filter`, { node, limit })
  ).data;
});

ipcMain.handle("get-metrics", async () => {
  try {
    const res = await axios.get<Metrics>(`${serverUri}/metrics`);
    if (res.status !== 200) {
      return [false, null]
    } else {
      return [true, res.data]
    }
  } catch(err) {
    return [false, null]
  }
})

ipcMain.handle("get-beatmap-details", async (event, node: Node) => {
  return (
    await axios.post<BeatmapDetails[]>(`${serverUri}/beatmapDetails`, node)
  ).data;
});
