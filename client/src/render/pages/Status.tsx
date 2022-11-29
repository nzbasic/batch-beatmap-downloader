import React, { useMemo } from "react";
import ColorScales from "color-scales";
import { bytesToFileSize } from "../util/fileSize";
import { CircularProgress } from "@mui/material";
import { TableHeader } from "../types/table";
import Table from "../components/util/Table";
import StatusTableRow from "../components/StatusTableRow";
import { useStatus } from "../context/StatusProvider";

const headers: TableHeader[] = [
  { title: "Total Size", key: "Size" },
  { title: "Remaining Size", key: "Progress" },
  { title: "Download Speed", key: "Speed" },
];

export const Status = () => {
  const { online, metrics, loading } = useStatus();

  const downloadsScale = new ColorScales(0, 50, ["#00ff00", "#ff0000"]);
  const bandwidthScale = new ColorScales(0, 5000, ["#00ff00", "#ff0000"]);

  const [currentDownloads, activeDownloads, currentBandwidth] = useMemo(() => {
    const currentDownloads = metrics?.Download?.CurrentDownloads ?? []
    const activeDownloads = currentDownloads.filter((i) => i.Active)
    const currentBandwidth = metrics?.Download?.CurrentBandwidthUsage ?? 0
    return [currentDownloads, activeDownloads, currentBandwidth]
  }, [metrics]);

  return (
    <div className="flex flex-col gap-4">
      <div className="content-box flex flex-col dark:text-white w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Server Status</span>
          {loading ? <CircularProgress size={25} /> : (
            <span className={`${online ? "text-green-500" : "text-red-500"} font-bold text-lg`}>
              {online ? "Online" : "Offline"}
            </span>
          )}
        </div>
      </div>
      {online && metrics && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div
              style={{backgroundColor: downloadsScale.getColor(activeDownloads.length).toHexString()}}
              className="bg-green-500 rounded shadow w-full h-24 border border-gray-500 dark:border-black"
            >
              <div className="text-black flex justify-between items-center w-full h-full px-8">
                <span className="font-bold text-5xl w-full text-center">{activeDownloads.length}</span>
                <span className="text-xl w-full font-medium text-center">Active Downloads</span>
              </div>
            </div>
            <div
              style={{backgroundColor: bandwidthScale.getColor(currentBandwidth / 1e6).toHexString()}}
              className="bg-red-500 rounded shadow w-full h-24 border border-gray-500 dark:border-black"
            >
              <div className="text-black flex justify-between items-center w-full h-full px-8">
                <div className="flex flex-col items-center w-full">
                  <span className="font-bold text-3xl">{(currentBandwidth / 1e6).toFixed(0)}Mbps</span>
                  <span>{(metrics.Download.CurrentBandwidthUsage / 1e6).toFixed(0)}Mbps Avg 1min</span>
                </div>
                <span className="text-xl w-full font-medium text-center">Bandwidth Use</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="content-box flex flex-col dark:text-white w-full">
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

            <div className="content-box flex flex-col dark:text-white w-full">
              <div className="flex flex-col gap-2">
                <span className="font-bold text-lg">Daily Stats</span>
                <div className="flex flex-col">
                  <span>{metrics.Download.DailyStats.Maps} Beatmap Sets Downloaded</span>
                  <span>{bytesToFileSize(metrics.Download.DailyStats.Size)} Downloaded</span>
                  <span>{metrics.Download.DailyStats.Completed} Completed Downloads</span>
                  <span>{bytesToFileSize(metrics.Download.DailyStats.Speed)}/s average speed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="content-box no-pad flex flex-col dark:text-white w-full">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-lg p-6 pb-2">Current Downloads (All Users)</span>
              {activeDownloads.length ? (
                <Table
                  data={activeDownloads}
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
