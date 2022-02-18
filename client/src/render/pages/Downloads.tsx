import { DownloadStatus } from "../../models/api";
import LinearProgress from "@mui/material/LinearProgress";
import { bytesToFileSize } from "../util/fileSize";
import { Link } from "react-router-dom";

interface PropTypes {
  downloadStatus: DownloadStatus;
}

export const Downloads = ({ downloadStatus }: PropTypes) => {
  const filesQueue = (downloadStatus?.all ?? []).length;
  const filesDownloaded = (downloadStatus?.completed ?? []).length;
  const filesFailed = (downloadStatus?.failed ?? []).length;
  const filesSkipped = (downloadStatus?.skipped ?? []).length;
  const totalSize = downloadStatus?.totalSize ?? 0;
  const totalProgress = downloadStatus?.totalProgress ?? 0;

  const calculateTotalProgress = () => {
    if (totalSize === 0) {
      return 0;
    }
    return (totalProgress / totalSize) * 100;
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {downloadStatus ? (
        <div className="bg-white dark:bg-monokai-dark rounded shadow p-6">
          <div className="flex flex-col">
            <span className="text-lg font-bold">Stats</span>
            <span>Files in queue: {filesQueue}</span>
            <span>Downloaded: {filesDownloaded}</span>
            <span>Failed: {filesFailed}</span>
            <span>Skipped: {filesSkipped}</span>
            <span>
              Remaining:{" "}
              {filesQueue - filesDownloaded - filesFailed - filesSkipped}{" "}
            </span>
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
            <span className="font-medium mt-4">Current Download</span>
            <div className="flex items-center">
              <div className="w-full">
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(downloadStatus?.currentProgress ?? "0")}
                />
              </div>
              <span className="ml-2">
                {parseInt(downloadStatus?.currentProgress ?? "0")}%
              </span>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};
