import axios from "axios";
import { Node } from "../../models/filter";
import { BeatmapDetails, DownloadDetails, QueryOrder } from "../../models/api";
import { E, serverUri } from "./main";
import { Metrics, MetricsV2 } from "../../models/metrics";
import { beatmapIds, loadBeatmaps } from "../beatmaps";
import { clientId } from "../download/settings";
import { FilterResponseV2 } from "../../models/api-v2";

export let currentQueryResult: FilterResponseV2;
export let currentDownloadDetails: DownloadDetails;

export const handleQuery = async (event: E, node: Node, limit?: number, order?: QueryOrder): Promise<DownloadDetails> => {
  const body: { node: Node; by?: string; direction?: string; limit?: number; clientId: string } = { node, ...order, clientId }
  if (limit) {
    body.limit = limit;
  }

  const res = (await axios.post<FilterResponseV2>(`${serverUri}/v2/filter`, body)).data
  currentQueryResult = res;

  await loadBeatmaps()
  let totalSize = 0;
  let totalSizeForce = 0;
  let sets = 0;
  const setsForce = res.SetIds.length;
  const beatmaps = res.Ids.length;

  const map = new Map<string, number>(Object.entries(res.SizeMap));
  map.forEach((size, setIdString) => {
    const setId = Number(setIdString);
    totalSizeForce += size;

    if (!beatmapIds.has(setId)) {
      totalSize += size;
      sets++;
    }
  })

  currentDownloadDetails = {
    totalSize,
    totalSizeForce,
    sets,
    setsForce,
    beatmaps,
  }

  return currentDownloadDetails
};

export const handleGetMetrics = async () => {
  try {
    const res = await axios.get<MetricsV2>(`${serverUri}/v2/metrics`);
    if (res.status !== 200) {
      return [false, null]
    } else {
      return [true, res.data]
    }
  } catch(err) {
    return [false, null]
  }
};

export const handleGetBeatmapDetails = async (event: E, page: number, pageSize: number) => {
  // page is 1 indexed, find Ids
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const ids = currentQueryResult.Ids.slice(start, end);

  return (
    await axios.post<BeatmapDetails[]>(`${serverUri}/beatmapDetails`, ids)
  ).data;
};
