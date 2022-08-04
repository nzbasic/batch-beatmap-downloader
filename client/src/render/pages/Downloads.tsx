import { Speed } from "../../models/api";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { useDownloads } from "../hooks/useDownloads";
import { useStatus } from "../hooks/useStatus";
import { DownloadSummary } from "../components/DownloadSummary";

export const Downloads = () => {
  const { downloads } = useDownloads()
  const { online } = useStatus()
  const [averageSpeed, setAverageSpeed] = useState<Speed[]>([])

  useEffect(() => {
    console.log(downloads)
    // if (downloadStatus?.currentDownloads) {
    //   let totalDownloadSpeed = 0
    //   for (const download of downloadStatus.currentDownloads) {
    //     const size = download.size * 8 / 1000 / 1000
    //     const time = download.time / 1000
    //     totalDownloadSpeed += (size / time)
    //   }

    //   const now = Date.now()
    //   const timeMinuteAgo = now - 60000
    //   const filtered = averageSpeed.filter(({ time }) => time > timeMinuteAgo)
    //   setAverageSpeed([...filtered, { speed: totalDownloadSpeed, time: now }])
    // }
  }, [downloads])

  if (!downloads.length) {
    return (
      <div className="container">
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
      <div className="container flex flex-col gap-2">
        <h1 className="text-lg font-bold">Download Stats</h1>
      </div>
      {downloads.map(download => (
        <DownloadSummary key={download.id} status={download} />
      ))}
    </div>
  )
};
