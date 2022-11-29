import { FilterRequest, FilterResponse } from "./api";

export interface DownloadStartV2 {
  Id: string;
  Client: string;
  SizeRemoved: number;
}

export interface DownloadUpdateV2 {
  Id: string;
  Client: string;
  Type: "pause" | "resume" | "delete"
}

export interface BeatmapDownloadV2 {
  Id: string;
  Client: string;
  SetId: string;
  Time: number;
}

export interface FilterResponseV2 extends FilterResponse {
  Id: string;
}

export interface FilterRequestV2 extends FilterRequest {
  ClientId: string;
}
