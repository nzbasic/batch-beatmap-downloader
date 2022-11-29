import Switch from "react-switch";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bytesToFileSize } from "../util/fileSize";
import { toast } from "react-toastify";
import Button from "./util/Button";
import { DownloadDetails } from "../../models/api";

interface PropTypes {
  result: DownloadDetails;
}

export const DownloadSettings = ({ result }: PropTypes) => {
  const [force, setForce] = useState(false);
  const [collection, setCollection] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const download = () => {
    toast.success(`Download started!`);
    window.electron.startDownload(force, collectionName)
  };

  const downloadDisabled = useMemo(() => {
    return collection && (collectionName === "")
  }, [collection, collectionName])

  const fileSize = useMemo(() => {
    return bytesToFileSize(force ? result.totalSizeForce : result.totalSize)
  }, [force, result.totalSizeForce, result.totalSize])

  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold text-lg dark:text-white">Download</span>
      <div className="flex flex-col gap-1">
        <span className="font-medium">Summary</span>
        <div className="flex flex-col gap-0">
          <span>
            {result.beatmaps} Beatmaps ({result.setsForce} Beatmap Sets)
          </span>
          <span>
            {force ? result.setsForce : result.sets} Sets to download
          </span>
          <span>Total Size: {fileSize}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-medium">Settings</span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span>Force Download All Maps</span>
            <Switch checked={force} onChange={(e) => setForce(e)} />
          </div>
          <div className="flex items-center gap-2">
            <span>Create Collection</span>
            <Switch checked={collection} onChange={(e) => setCollection(e)} />
            {collection && (
              <input
                className="input-height p-2 w-40 border-gray-300 border rounded focus:outline-blue-500"
                placeholder="Name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Link className={`${downloadDisabled ? 'pointer-events-none' : ''}`} to="/downloads">
          <Button color="green" onClick={download} disabled={downloadDisabled}>
            Download
          </Button>
        </Link>
        {downloadDisabled && (
          <span className="text-red-500 text-sm ml-4">
            Collection name cannot be empty
          </span>
        )}
      </div>
    </div>
  );
};
