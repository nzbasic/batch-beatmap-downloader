import { DownloadStatus } from "../../models/api";
import LinearProgress from "@mui/material/LinearProgress";
import { bytesToFileSize } from "../util/fileSize";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface PropTypes {
  downloadStatus: DownloadStatus;
}

export const Downloads = ({ downloadStatus }: PropTypes) => {
  const [paused, setPaused] = useState(true)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    window.electron.isDownloadPaused().then(res => {
      setLoading(false)
      setPaused(res)
    })
  }, [])

  if (!downloadStatus) {
    return (
      <div className="bg-white dark:bg-monokai-dark rounded shadow p-6">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">No downloads in progress</span>
          <Link to="/query">
            <span className="font-medium mt-4 text-blue-500 hover:underline">
              Go to the beatmap search page to start a download
            </span>
          </Link>
        </div>
      </div>
    )
  }

  const filesQueue = downloadStatus.all.length;
  const filesDownloaded = downloadStatus.completed.length;
  const filesFailed = downloadStatus.failed.length;
  const filesSkipped = downloadStatus.skipped.length;
  const totalSize = downloadStatus.totalSize;
  const totalProgress = downloadStatus.totalProgress;
  const filesRemaining = filesQueue - filesDownloaded - filesSkipped - filesFailed

  const pause = () => {
    window.electron.pauseDownload();
    setPaused(true)
  }

  const resume = () => {
    window.electron.resumeDownload();
    setPaused(false)
  }

  const calculateTotalProgress = () => {
    if (totalSize === 0) {
      return 0;
    }
    return (totalProgress / totalSize) * 100;
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="bg-white dark:bg-monokai-dark rounded shadow p-6">
        <div className="flex flex-col">
          <span className="text-lg font-bold">Stats</span>
          <span>Files in queue: {filesQueue}</span>
          <span>Downloaded: {filesDownloaded}</span>
          <span>Failed: {filesFailed}</span>
          <span>Skipped: {filesSkipped}</span>
          <span>Remaining: {filesRemaining}</span>
          <span>Total size: {bytesToFileSize(totalSize)}</span>
          <span>
            Size of remaining downloads:{" "}
            {bytesToFileSize(totalSize - totalProgress)}
          </span>
          <span className="font-medium mt-4">Total Progress</span>
          <div className="flex items-center">
            <div className="w-full">
              <LinearProgress
                variant="determinate"
                value={calculateTotalProgress()}
              />
            </div>
            <span className="ml-2">
              {calculateTotalProgress().toFixed(0)}%
            </span>
          </div>
          <span className="font-medium mt-4">Current Beatmap Progress</span>
          <div className="flex items-center">
            <div className="w-full">
              <LinearProgress
                variant="determinate"
                value={parseFloat(downloadStatus.currentProgress)}
              />
            </div>
            <span className="ml-2">
              {parseInt(downloadStatus.currentProgress)}%
            </span>
          </div>
          {!isLoading && (filesRemaining !== 0) && (
            <div className="flex gap-2 mt-2">
              {paused && (filesRemaining !== 0) ? (
                <button onClick={() => resume()} className="text-white px-2 py-1 bg-green-500 hover:bg-green-600 rounded">Resume</button>
              ) : (
                <button onClick={() => pause()} className="text-white px-2 py-1 bg-red-500 hover:bg-red-600 rounded">Pause</button>
              )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
