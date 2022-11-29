import React, { useState } from "react";
import Switch from "react-switch";
import { useSettings } from "../context/SettingsProvider";
import { Browse } from "./Browse";
import { NumberRangeSelector } from "./util/NumberRangeSelector";

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
          <span className="w-52">Max Concurrent Downloads</span>
          <NumberRangeSelector
            min={1}
            max={5}
            initial={maxConcurrentDownloads}
            onChange={i => setMaxConcurrentDownloads(i)}
          />
        </div>
      </div>
    </div>
  );
};
