import React from "react";
import { BasicStatus } from "../components/BasicStatus";
import { InvalidPath } from "../components/InvalidPath";
import { FindMissingMaps } from "../components/MissingMaps";
import { SampleFilters } from "../components/SampleFilters";
import { Settings } from "../components/Settings";
import { Temporary } from "../components/Temporary";
import { useSettings } from "../context/SettingsProvider";

const videoUrl = "https://www.youtube.com/watch?v=_Nuz0TVF1IY"

export const Home = () => {
  const { validPath } = useSettings();

  return (
    <div className="flex flex-col gap-4">
      <div className="content-box">
        <span className="font-bold">Video Guide:</span>
        <button
          onClick={() => window.electron.openUrl(videoUrl)}
          className="text-blue-500 hover:underline py-2 px-4 rounded"
        >
          Batch Beatmap Downloader in 60 seconds
        </button>
      </div>
      <Settings />
      <Temporary />
      <BasicStatus />

      {!validPath ? <InvalidPath /> : (
        <div className="flex flex-col gap-4">
          <FindMissingMaps />
          <SampleFilters />
        </div>
      )}
    </div>
  );
};
