import { RowProps, TableData } from "../types/table";
import classNames from 'classnames'
import React from "react";
import { bytesToFileSize } from "../util/fileSize";
import humanizeDuration from "humanize-duration";

export interface CurrentDownloadV2 {
  Size: number;
  Progress: number;
  Speed: number;
  Active: boolean;
  Finished: boolean;
}

const parseStatusRow = (key: keyof CurrentDownloadV2, entry: CurrentDownloadV2) => {
  if (key === "Size") {
    return <>{bytesToFileSize(entry[key])}</>
  }

  if (key === "Progress") {
    const remaining = entry.Size - entry.Progress;
    return <>{bytesToFileSize(remaining)}</>
  }

  if (key === "Speed") {
    return <>{bytesToFileSize(entry[key])}/s</>
  }

  return <>{entry[key]}</>
}

const StatusTableRow: React.FC<RowProps> = ({ entry, headers }) => (
  <>
    {headers.map((header, index) => (
      <td
        key={header.key}
        className={classNames(
          { 'pl-6': index === 0 },
          'p-1 px-3 h-12 text-sm whitespace-pre-wrap',
        )}
      >
        {parseStatusRow(header.key as keyof CurrentDownloadV2, entry as CurrentDownloadV2)}
      </td>
    ))}
  </>
);

export default StatusTableRow;
