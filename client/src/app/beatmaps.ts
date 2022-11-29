import fs from "fs";
import { getSongsFolder } from "./settings";

export let beatmapIds: Set<number> = new Set();

export const loadBeatmaps = async () => {
  const path = await getSongsFolder()
  const dir = await fs.promises.readdir(path);

  // get number at start of each file name
  const ids = dir.map((file) => {
    const number = /^\d+/.exec(file);
    return number ? parseInt(number[0]) : 0;
  });

  beatmapIds = new Set(ids);
};
