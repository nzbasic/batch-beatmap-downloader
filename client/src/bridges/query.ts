import {
  ipcRenderer,
} from "electron";
import { BeatmapDetails, DownloadDetails, QueryOrder } from "../models/api";
import { Node } from "../models/filter";
import { Metrics, MetricsV2 } from "../models/metrics";
import { handleGenericError } from "./main";

export const handleQuery = async (node: Node, limit?: number, order?: QueryOrder) => {
  try {
    const res = (await ipcRenderer.invoke(
      "query",
      node,
      limit,
      order
    )) as DownloadDetails;
    return res;
  } catch (e) {
    return handleGenericError(e);
  }
};

export const handleGetBeatmapDetails = async (page: number, pageSize: number) => {
  try {
    const res = (await ipcRenderer.invoke(
      "get-beatmap-details",
      page,
      pageSize
    )) as BeatmapDetails[];
    return res;
  } catch (e) {
    return handleGenericError(e);
  }
}

export const handleGetMetrics = () => ipcRenderer.invoke("get-metrics") as Promise<[boolean, MetricsV2]>
