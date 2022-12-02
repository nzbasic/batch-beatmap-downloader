import React, { useState } from "react";
import Switch from "react-switch";
import { useSettings } from "../context/SettingsProvider";
import { Browse } from "./Browse";
import QuestionMark from "@mui/icons-material/QuestionMark";
import { Tooltip } from "@mui/material";
import { NumericInput } from "./util/NumericInput";

const parallelTooltip = `Advanced: The number of parallel requests made per download.
Increasing this may increase your total download speed.
Increasing is too high can saturate your network or lag your computer.
You must restart (pause and resume) your downloads for this to take effect.
`

export const Settings = () => {
  const {
    path,
    setPath,
    altPath,
    setAltPath,
    beatmapSetCount,
    darkMode,
    toggleDarkMode,
    maxConcurrentDownloads,
    setMaxConcurrentDownloads
  } = useSettings()
  const [altPathEnabled, setAltPathEnabled] = useState(!!altPath);

  const enableAltPath = (enabled: boolean) => {
    setAltPathEnabled(enabled);
    if (!enabled) setAltPath("")
  }

  return (
    <div className="content-box flex flex-col dark:text-white w-full">
      <span className="font-bold text-lg">Settings</span>
      <div className="flex flex-col gap-4">
        <div className="flex items-center mt-4 gap-2">
          <span className="w-52">osu! Path:</span>
          <Browse path={path} update={setPath} />
          {!altPathEnabled && <span>{beatmapSetCount} Beatmap Sets Found</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-52">Alternate Songs Path:</span>
          <Switch onChange={(mode) => enableAltPath(mode)} checked={altPathEnabled} />
          {altPathEnabled && <Browse path={altPath} update={setAltPath} />}
          {altPathEnabled && <span>{altPath ? beatmapSetCount : 0} Beatmap Sets Found</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-52">Dark Mode:</span>
          <Switch onChange={(mode) => toggleDarkMode(mode)} checked={darkMode} />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-52 shrink-0">
            Parallel Downloads
            <Tooltip title={parallelTooltip}>
              <QuestionMark className="bg-sky-500 rounded-full p-1 ml-2" />
            </Tooltip>
          </span>
          <NumericInput
            className="w-20"
            value={maxConcurrentDownloads ?? 3}
            onChange={setMaxConcurrentDownloads}
          />
        </div>
      </div>
    </div>
  );
};
