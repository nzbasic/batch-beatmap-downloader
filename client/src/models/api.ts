export const serverUri = "api.nzbasic.com"

export interface FilterRequest {
  groups: Group[];
  rules: Rule[];
}

export interface FilterResponse {
  Ids: number[];
  SetIds: number[];
  Hashes: string[]
  SizeMap: Map<number, number>;
}

export interface DownloadStatus {
  all: number[];
  completed: number[];
  skipped: number[];
  failed: number[];
  currentProgress: string;
  currentSize: string;
  totalSize: number;
  totalProgress: number;
  force: boolean;
  lastDownloadTime?: number
  lastDownloadSize?: number
  currentDownloads?: {
    time: number,
    size: number
  }[]
}

export interface Group {
  number: number;
  connector: string;
  not: boolean;
  parent: number;
}

export interface Rule {
  type: string;
  value: string;
  field: string;
  operator: string;
  group: number;
}

export interface BeatmapDetails {
  Title: string;
  Artist: string;
  Creator: string;
  Version: string;
  Hp: number;
  Cs: number;
  Od: number;
  Ar: number;
  TimingPoints: string;
  HitObjects: string;
  Hash: string;
  Genre: string;
  ApprovedDate: number;
  Approved: string;
  Bpm: number;
  Id: number;
  SetId: number;
  Stars: number;
  FavouriteCount: number;
  HitLength: number;
  Language: string;
  MaxCombo: number;
  Mode: string;
  TotalLength: number;
  Tags: string;
  Source: string;
  LastUpdate: number;
  PassCount: number;
  PlayCount: number;
  Path: string;
  Stream: number;
}

export interface BeatmapHashMap {
  [hash: string]: number;
}

export interface MissingMaps {
  ids: number[],
  totalSize: number
}
