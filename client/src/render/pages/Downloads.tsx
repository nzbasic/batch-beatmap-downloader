import { DownloadStatus } from "../../models/api";
import LinearProgress from "@mui/material/LinearProgress";
import { bytesToFileSize } from "../util/fileSize";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import humanizeDuration from 'humanize-duration';

interface PropTypes {
  downloadStatus: DownloadStatus;
}

interface Speed {
  speed: number;
  time: number;
}

export const Downloads = ({ downloadStatus }: PropTypes) => {
  const [paused, setPaused] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [serverDown, setServerDown] = useState(false)
  const [averageSpeed, setAverageSpeed] = useState<Speed[]>([])

  useEffect(() => {
    // keep track of speed in last minute
    if (lastDownloadTime && lastDownloadSize) {
      const now = Date.now()
      const speed = calulcateSpeed()
      const timeMinuteAgo = now - 60000
      const filtered = averageSpeed.filter(({ time }) => time > timeMinuteAgo)
      setAverageSpeed([...filtered, { speed, time: now }])
    }
  }, [downloadStatus])

  useEffect(() => {
    window.electron.isDownloadPaused().then(res => {
      setLoading(false)
      setPaused(res)
    })

    window.electron.listenForServerDown((down) => {
      if (!down && serverDown && !paused) {
        toast.success("Server is back up, resuming download")
        resume()
      }
      setServerDown(down)
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
  const lastDownloadTime = downloadStatus.lastDownloadTime??0
  const lastDownloadSize = downloadStatus.lastDownloadSize??0

  const currentSpeed = () => {
    return averageSpeed.reduce((acc, { speed }) => acc + speed, 0) / averageSpeed.length
  }

  const calulcateSpeed = () => {
    if (lastDownloadTime === 0) {
      return 0
    }

    const size = lastDownloadSize * 8 / 1000 / 1000
    const time = lastDownloadTime / 1000
    return size / time
  }

  const estimatedTimeLeft = () => {
    if (totalProgress === 0) {
      return "Calculating..."
    }

    const remainingSize = (totalSize - totalProgress)*8
    const speed = currentSpeed() * 1000 * 1000
    if (speed === 0) {
      return "Calculating..."
    }

    const remainingTime = (remainingSize / speed) * 1000
    return humanizeDuration(remainingTime, { round: true })
  }

  const pause = () => {
    setLoading(true)
    setPaused(true)
    window.electron.pauseDownload().then(() => {
      toast.success("Download paused")
      setLoading(false)
    })
  }

  const resume = () => {
    setLoading(true)
    setPaused(false)
    window.electron.resumeDownload().then(() => {
      toast.success("Download resumed")
      setLoading(false)
    });
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
          <span>Current Speed: {currentSpeed().toFixed(0)}Mbps</span>
          {!paused && <span>Estimated time left: {estimatedTimeLeft()}</span>}
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
          {(filesRemaining !== 0) && (
            isLoading ? (<CircularProgress />) : (
              <div className="flex gap-2 mt-2">
                {serverDown ? (
                  <span className="text-red-500">Server went down. Will resume when server is back up.</span>
                ) : (
                  (paused) && (filesRemaining !== 0) ? (
                    <button onClick={() => resume()} className="text-white px-2 py-1 bg-green-500 hover:bg-green-600 rounded">Resume</button>
                  ) : (
                    <button onClick={() => pause()} className="text-white px-2 py-1 bg-red-500 hover:bg-red-600 rounded">Pause</button>
                  )
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
