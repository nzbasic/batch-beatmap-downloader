import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { useCallback, useState } from "react"
import { Link } from "react-router-dom";
import { MissingMaps } from "../../models/api";
import { bytesToFileSize } from "../util/fileSize";

export const FindMissingMaps = () => {
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState<MissingMaps | null>(null)

  const checkCollections = useCallback(async () => {
    setLoading(true);
    setMissing(null);
    const res = await window.electron.checkCollections();
    setMissing(res)
    setLoading(false);
  }, [])

  const download = useCallback(() => {
    window.electron.download(missing?.ids??[], missing?.totalSize??0, false, [], "")
  }, [missing])

  return (
    <div className="container gap-2 flex flex-col dark:text-white w-full items-start">
      <span className="font-bold text-lg mb-4">Download missing maps (from collections)</span>
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => checkCollections()}
          disabled={loading}
          className={`
            ${loading ? "bg-blue-400 hover:bg-blue-400" : ""}
            bg-blue-600 rounded hover:bg-blue-700 transition duration-150 px-2 py-1 text-white font-medium
          `}
        >
          Check Collections
        </button>
        {loading && <CircularProgress size={25} />}
      </div>

      {missing && (
        <div className="flex flex-col">
          <span>Found {missing.ids.length} map(s) that can be downloaded.</span>
          {missing.ids.length > 0 && (
            <div className="flex flex-col items-start gap-2">
              <span>Total size: {bytesToFileSize(missing.totalSize)}</span>
              <Link className={`${loading ? 'pointer-events-none' : ''}`} to="/downloads">
                <button
                  onClick={download}
                  disabled={loading}
                  className="bg-blue-600 rounded hover:bg-blue-700 transition duration-150 px-2 py-1 text-white font-medium flex items-center justify-center"
                >
                  Download
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
