import React, { useEffect, useState } from "react";
import { Metrics } from "../../models/metrics";
import ColorScales from "color-scales";
import { bytesToFileSize } from "../util/fileSize";
import { CircularProgress } from "@mui/material";
import { TableHeader } from "../types/table";
import Table from "../components/util/Table";
import StatusTableRow from "../components/StatusTableRow";

const headers: TableHeader[] = [
  { title: "Total Size", key: "TotalSize" },
  { title: "Remaining Size", key: "RemainingSize" },
  { title: "Download Speed", key: "AverageSpeed" },
  { title: "Time Left", key: "EstTimeLeft" }
];

export const Status = () => {
  const [status, setStatus] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setLoading] = useState(true);
  const currentDownloads = metrics?.Download?.CurrentDownloads ?? [];

  const downloadsScale = new ColorScales(0, 50, ["#00ff00", "#ff0000"]);
  const bandwidthScale = new ColorScales(0, 5000, ["#00ff00", "#ff0000"]);

  const getActiveDownloads = () => {
    return currentDownloads
      .filter((i) => !i.Ended)
      .filter((i) => i.EstTimeLeft > 0);
  };

  const getCurrentBandwidth = () => {
    const active = getActiveDownloads();
    return active.reduce<number>((acc, cur) => acc + cur.AverageSpeed, 0);
  };

  const collectMetrics = () => {
    window.electron.getMetrics().then(([online, data]) => {
      setStatus(online);
      setMetrics(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    collectMetrics();
    const interval = setInterval(() => collectMetrics(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="container flex flex-col dark:text-white w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Server Status</span>
          {isLoading ? <CircularProgress size={25} /> : (
            <span className={`${status ? "text-green-500" : "text-red-500"} font-bold text-lg`}>
              {status ? "Online" : "Offline"}
            </span>
          )}
        </div>
      </div>
      {status && metrics && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div
              style={{backgroundColor: downloadsScale.getColor(getActiveDownloads().length).toHexString()}}
              className="bg-green-500 rounded shadow w-full h-24 border border-gray-500 dark:border-black"
            >
              <div className="text-black flex justify-between items-center w-full h-full px-8">
                <span className="font-bold text-5xl w-full text-center">{getActiveDownloads().length}</span>
                <span className="text-xl w-full font-medium text-center">Active Downloads</span>
              </div>
            </div>
            <div
              style={{backgroundColor: bandwidthScale.getColor(getCurrentBandwidth() / 1e6).toHexString()}}
              className="bg-red-500 rounded shadow w-full h-24 border border-gray-500 dark:border-black"
            >
              <div className="text-black flex justify-between items-center w-full h-full px-8">
                <div className="flex flex-col items-center w-full">
                  <span className="font-bold text-3xl">{(getCurrentBandwidth() / 1e6).toFixed(0)}Mbps</span>
                  <span>{(metrics.Download.CurrentBandwidthUsage / 1e6).toFixed(0)}Mbps Avg 1min</span>
                </div>
                <span className="text-xl w-full font-medium text-center">Bandwidth Usage</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="container flex flex-col dark:text-white w-full">
              <div className="flex flex-col gap-2">
                <span className="font-bold text-lg">Database Status</span>
                <div className="flex flex-col">
                  <span>{metrics.Database.NumberStoredRanked} Ranked Beatmaps</span>
                  <span>{metrics.Database.NumberStoredLoved} Loved Beatmaps</span>
                  <span>{metrics.Database.NumberStoredUnranked} Unranked Beatmaps</span>
                  <span>Last Beatmap Added on {new Date(metrics.Database.LastBeatmapAdded).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="container flex flex-col dark:text-white w-full">
              <div className="flex flex-col gap-2">
                <span className="font-bold text-lg">Daily Stats</span>
                <div className="flex flex-col">
                  <span>{metrics.Download.DailyStats.Maps} Beatmap Sets Downloaded</span>
                  <span>{bytesToFileSize(metrics.Download.DailyStats.Size)} Downloaded</span>
                  <span>{currentDownloads.filter((i) => i.Ended).length} Completed Downloads</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container no-pad flex flex-col dark:text-white w-full">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-lg p-6 pb-2">Current Downloads</span>
              {getActiveDownloads().length ? (
                <Table
                  data={getActiveDownloads()}
                  headers={headers}
                  RenderRow={StatusTableRow}
                />
              ) : (
                <span className="font-medium p-6">No active downloads</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
