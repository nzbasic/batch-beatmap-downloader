import React, { useState } from "react";
import Switch from "react-switch";
import { useSettings } from "../context/SettingsProvider";
import { Browse } from "./Browse";
import { NumericInput } from "./util/NumericInput";
import { Tooltip } from "./util/Tooltip";

const parallelTooltip = `Advanced: The number of parallel requests made per download.
Increasing this may increase your total download speed.
Increasing is too high can saturate your network or lag your computer.
You must restart (pause and resume) your downloads for this to take effect.
Maximum: 25
`

export const Settings = () => {
  const {
    settings,
    setPath,
    setAltPathEnabled,
    setAltPath,
    toggleDarkMode,
    setMaxConcurrentDownloads
  } = useSettings()

  const {
    path,
    altPathEnabled,
    altPath,
    darkMode,
    beatmapSetCount,
    maxConcurrentDownloads
  } = settings

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
          <Switch onChange={(mode) => setAltPathEnabled(mode)} checked={altPathEnabled} />
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
            <Tooltip title={parallelTooltip} />
          </span>
          <NumericInput
            className="w-20"
            max={25}
            min={1}
            value={maxConcurrentDownloads ?? 5}
            onChange={(value) => setMaxConcurrentDownloads(Math.max(1, Math.min(25, value)))}
          />
        </div>
      </div>
    </div>
  );
};
