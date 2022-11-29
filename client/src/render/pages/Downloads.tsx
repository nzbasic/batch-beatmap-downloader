import { Link } from "react-router-dom";
import React, { useMemo } from "react";
import { useDownload } from "../context/DownloadProvider";
import { DownloadSummary } from "../components/DownloadSummary";
import { LinearProgress } from "@mui/material";
import { useStatus } from "../context/StatusProvider";

export const Downloads = () => {
  const { downloads } = useDownload()
  const { online } = useStatus()

  const [maps, speed, remaining, progress] = useMemo(() => {
    let maps = 0;
    let remaining = 0;
    let speed = 0;
    for (const download of downloads) {
      maps += download.all;
      if (download.speed && !download.paused) speed += download.speed;
      remaining += download.all - download.completed - download.failed - download.skipped;
    }

    const progress = maps === 0 ? 0 : (maps - remaining) / maps
    return [maps, speed, remaining, progress]
  }, [downloads]);

  if (!online) {
    return (
      <div className="content-box">
        Server connection: <span className="text-red-500">Offline</span>
      </div>
    )
  }

  if (!downloads.length) {
    return (
      <div className="content-box">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">No downloads found</span>
          <Link to="/query">
            <span className="font-medium mt-4 text-blue-500 hover:underline">
              Go to the beatmap search page to start a download
            </span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="content-box flex flex-col">
        <h1 className="text-lg font-bold mb-4">Download Stats</h1>
        <div className="flex items-center">
          <div className="w-44 label">Beatmaps Downloading</div>
          <span>{maps}</span>
        </div>

        <div className="flex items-center">
          <div className="w-44 label">Remaining Downloads</div>
          <span>{remaining}</span>
        </div>

        <div className="flex items-center">
          <div className="w-44 label">Total Speed</div>
          <span>{speed.toFixed(2)}MB/s</span>
        </div>

        <div className="w-full mt-4">
          <LinearProgress
            value={progress * 100}
            variant="determinate"
          />
        </div>
      </div>
      {downloads.map(download => (
        <DownloadSummary key={download.id} status={download} />
      ))}
    </div>
  )
};
