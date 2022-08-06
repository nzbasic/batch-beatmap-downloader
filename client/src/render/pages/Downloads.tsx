import { Link } from "react-router-dom";
import React from "react";
import { useDownloads } from "../hooks/useDownloads";
import { DownloadSummary } from "../components/DownloadSummary";

export const Downloads = () => {
  const { downloads } = useDownloads()

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
