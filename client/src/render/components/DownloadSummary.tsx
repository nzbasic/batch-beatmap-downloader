import React, { useEffect, useState } from "react"
import { DownloadStatus, Speed } from "../../models/api"
import humanizeDuration from 'humanize-duration';
import { toast } from "react-toastify";
import { bytesToFileSize } from "../util/fileSize";
import { LinearProgress } from "@mui/material";
import { useStatus } from "../hooks/useStatus";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { BasicStatus } from "./BasicStatus";

interface PropTypes {
  status: DownloadStatus
}

export const DownloadSummary: React.FC<PropTypes> = ({ status }) => {
  const [loading, setLoading] = useState(false)
  const [averageSpeed, setAverageSpeed] = useState<Speed[]>([])
  const { online } = useStatus()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (status.currentDownloads) {
      let totalDownloadSpeed = 0
      for (const download of status.currentDownloads) {
        const size = download.size * 8 / 1000 / 1000
        const time = download.time / 1000
        totalDownloadSpeed += (size / time)
      }

      const now = Date.now()
      const timeMinuteAgo = now - 60000
      const filtered = averageSpeed.filter(({ time }) => time > timeMinuteAgo)
      setAverageSpeed([...filtered, { speed: totalDownloadSpeed, time: now }])
    }
  }, [status])

  const filesQueue = status.all.length;
  const filesDownloaded = status.completed.length;
  const filesFailed = status.failed.length;
  const filesSkipped = status.skipped.length;
  const totalSize = status.totalSize;
  const totalProgress = status.totalProgress;
  const filesRemaining = filesQueue - filesDownloaded - filesSkipped - filesFailed
  const isFinished = status.totalProgress === status.totalSize

  const currentSpeed = () => {
    if (status.paused) return 0
    return averageSpeed.reduce((acc, { speed }) => acc + speed, 0) / averageSpeed.length
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

  const remove = () => {
    setLoading(true)
    window.electron.deleteDownload(status.id).then(() => {
      toast.success("Download deleted")
      setLoading(false)
    })
  }

  const togglePause = async () => {
    setLoading(true)
    if (status.paused) {
      await window.electron.resumeDownload2(status.id)
      toast.success("Download resumed")
    } else {
      setAverageSpeed([])
      await window.electron.pauseDownload2(status.id)
      toast.success("Download paused")
    }
    setLoading(false)
  }

  const calculateTotalProgress = () => {
    if (totalSize === 0) {
      return 0;
    }
    return (totalProgress / totalSize) * 100;
  };

  if (!online) {
    return (
      <BasicStatus />
    )
  }

  return (
    <div className="container hover:border-blue-400 flex flex-col" >
      <div className="flex items-center gap-2">
        <button onClick={remove} disabled={loading}>
          <DeleteForeverIcon className="warning z-20" />
        </button>
        {!isFinished && (
          <button className="hover:text-blue-600 cursor-pointer" disabled={loading} onClick={togglePause}>
            {status.paused ? <PlayArrowIcon /> : <PauseIcon />}
          </button>
        )}

        <div className="w-60 text-sm">{bytesToFileSize(totalProgress)}/{bytesToFileSize(totalSize)}</div>
        <div className="w-full">
          <LinearProgress
            variant="determinate"
            value={calculateTotalProgress()}
          />
        </div>
        <span className="ml-2">
          {calculateTotalProgress().toFixed(0)}%
        </span>
        <ExpandMoreIcon className="cursor-pointer hover:text-black dark:hover:text-white" onClick={() => setExpanded(prev => !prev)}/>
      </div>

      {expanded && (
        <div className="flex flex-col gap-0 pt-4">
          <span>Downloaded: {filesDownloaded}</span>
          <span>Remaining: {filesRemaining}</span>
          <div className="flex items-center gap-1">
            <span>{bytesToFileSize(totalProgress)} / {bytesToFileSize(totalSize)}</span>
            {!status.paused && <span>@ {Number.isNaN(currentSpeed()) ? "Loading..." : currentSpeed().toFixed(2) + "Mbps"}</span>}
          </div>
          {!status.paused && <span>ETA: {estimatedTimeLeft()}</span>}
        </div>
      )}
    </div>
  );
}
