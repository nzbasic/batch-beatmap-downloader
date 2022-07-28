import { FilterResponse } from "../../models/api";
import Switch from "react-switch";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { bytesToFileSize } from "../util/fileSize";
import { toast } from "react-toastify";

interface PropTypes {
  result: FilterResponse;
  existing: number[];
}

export const DownloadSettings = ({ result, existing }: PropTypes) => {
  const [force, setForce] = useState(false);
  const [collection, setCollection] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const download = () => {
    toast.success(`Download started!`);
    window.electron.download(result.SetIds, calculateSize(), force, result.Hashes, collectionName).then(res => {
      toast.success("Download Finished")
    })
  };

  const matching = (condition: boolean) => {
    // find number of ids in result.SetIds that are not in existing
    const newIds = result.SetIds.filter((id) => {
      if (condition) {
        return existing.includes(id);
      } else {
        return !existing.includes(id);
      }
    });
    return newIds.length;
  };

  const calculateSize = () => {
    let totalSize = 0;

    // the response map is actually a raw object, so it needs to be converted to a map object
    const map = new Map<string, number>(Object.entries(result.SizeMap));
    if (force) {
      map.forEach((size) => (totalSize += size));
    } else {
      map.forEach((size, setId) => {
        if (!existing.includes(parseInt(setId))) {
          totalSize += size;
        }
      });
    }

    return totalSize;
  };

  const downloadDisabled = () => {
    return collection && (collectionName === "")
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold text-lg dark:text-white">Download</span>
      <div className="flex flex-col gap-1">
        <span className="font-medium">Summary</span>
        <div className="flex flex-col gap-0">
          <span>
            {result.Ids.length} Beatmaps ({result.SetIds.length} Beatmap Sets)
          </span>
          <span>{matching(true)} Sets already downloaded</span>
          <span>
            {force ? result.SetIds.length : matching(false)} Sets to download
          </span>
          <span>Total Size: {bytesToFileSize(calculateSize())}</span>
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
        <Link className={`${downloadDisabled() ? 'pointer-events-none' : ''}`} to="/downloads">
          <button
            onClick={download}
            disabled={downloadDisabled()}
            className="bg-green-500 hover:bg-green-400 text-white transition duration-150 px-2 py-1 rounded text-lg font-medium self-start"
          >
            Download
          </button>
        </Link>
        {downloadDisabled() && (
          <span className="text-red-500 text-sm ml-4">
            Collection name cannot be empty
            </span>
        )}
      </div>
    </div>
  );
};
