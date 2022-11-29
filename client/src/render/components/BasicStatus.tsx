import React from "react";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useStatus } from "../context/StatusProvider";

export const BasicStatus = () => {
  const { loading, online, metrics } = useStatus();

  return (
    <div className="content-box flex flex-col dark:text-white w-full">
      <div className="flex flex-col gap-2">
        <span className="font-bold text-lg">Basic Status</span>
        <div className="flex flex-col">
          {loading ? <CircularProgress /> : (
            <span className={`${online ? "text-green-500" : "text-red-500"}`}>
              Server connection: {online ? "Online" : "Offline"}
            </span>
          )}
          {metrics && (
            <div className="flex flex-col">
              <span>Active downloads: {(metrics.Download?.CurrentDownloads ?? []).filter((i) => i.Active).length}</span>
              <span>Ranked beatmaps available: {metrics.Database.NumberStoredRanked}</span>
              <span>Loved beatmaps available: {metrics.Database.NumberStoredLoved}</span>
              <span>Unranked beatmaps available: {metrics.Database.NumberStoredUnranked}</span>
              <span>Last beatmap added: {new Date(metrics.Database.LastBeatmapAdded).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <Link to="/status" className="text-blue-500 font-medium">
          See more stats
        </Link>
      </div>
    </div>
  );
};
