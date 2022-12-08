import React, { useMemo, useState } from "react"
import { ReportedDownloadStatus } from "../../models/api"
import humanizeDuration from 'humanize-duration';
import { toast } from "react-toastify";
import { bytesToFileSize } from "../util/fileSize";
import { LinearProgress } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface PropTypes {
  status: ReportedDownloadStatus
}

export const DownloadSummary: React.FC<PropTypes> = ({ status }) => {
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const estimatedTimeLeft = useMemo(() => {
    if (status.speed === 0) {
      return "Calculating..."
    }

    const remainingSize = (status.totalSize - status.totalProgress)
    const speed = status.speed * 1024 * 1024
    if (speed === 0) {
      return "Calculating..."
    }

    const remainingTime = (remainingSize / speed) * 1000
    return humanizeDuration(remainingTime, { round: true })
  }, [status.speed, status.totalSize, status.totalProgress])

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
      await window.electron.resumeDownload(status.id)
      toast.success("Download resumed")
    } else {
      await window.electron.pauseDownload(status.id)
      toast.success("Download paused")
    }
    setLoading(false)
  }

  const progress = useMemo(() => {
    if (status.totalSize === 0) {
      return 0;
    }
    return (status.totalProgress / status.totalSize) * 100;
  }, [status.totalSize, status.totalProgress]);

  const [remaining, finished] = useMemo(() => {
    const { all, completed, failed, skipped } = status;
    const remaining = all - completed - skipped - failed;
    const finished = remaining === 0
    return [remaining, finished]
  }, [status])

  return (
    <div className="content-box hover:border-blue-400 flex flex-col" >
      <div className="flex items-center gap-2">
        <button onClick={remove} disabled={loading}>
          <DeleteForeverIcon className="warning z-20" />
        </button>
        {!finished && (
          <button className="hover:text-blue-600 cursor-pointer" disabled={loading} onClick={togglePause}>
            {status.paused ? <PlayArrowIcon /> : <PauseIcon />}
          </button>
        )}

        <div className="w-60 text-sm">{bytesToFileSize(status.totalProgress)}/{bytesToFileSize(status.totalSize)}</div>
        <div className="w-full">
          {remaining > 0 ? (
            <LinearProgress
              variant="determinate"
              value={progress}
            />
          ) : (
            <>Complete!</>
          )}
        </div>
        <span className="ml-2">
          {progress.toFixed(0)}%
        </span>
        <ExpandMoreIcon className="cursor-pointer hover:text-black dark:hover:text-white" onClick={() => setExpanded(prev => !prev)}/>
      </div>

      {expanded && (
        <div className="flex flex-col gap-0 pt-4">
          <div className="flex items-center">
            <div className="w-44 label">Sets Downloaded</div>
            <span>{status.completed}</span>
          </div>

          <div className="flex items-center">
            <div className="w-44 label">Sets Remaining</div>
            <span>{remaining}</span>
          </div>

          <div className="flex items-center">
            <div className="w-44 label">Sets Skipped</div>
            <span>{status.skipped}</span>
          </div>

          <div className="flex items-center">
            <div className="w-44 label">Sets Failed</div>
            <span>{status.failed}</span>
          </div>

          <div className="flex items-center">
            <div className="w-44 label">Speed</div>
            <span>{`${status.speed.toFixed(2)}MB/s`}</span>
          </div>

          {!status.paused && remaining !== 0 &&
            <div className="flex items-center">
              <div className="w-44 label">ETA</div>
              <span>{estimatedTimeLeft}</span>
            </div>
          }
        </div>
      )}
    </div>
  );
}
