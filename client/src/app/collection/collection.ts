import settings from "electron-settings";
import { readCollections, writeCollections } from "./parse";

export const addCollection = async (hashes: string[], name: string) => {
  const osuPath = await settings.get("path") as string;
  const collections = await readCollections(osuPath)

  collections.collections.push({
    name,
    numberMaps: hashes.length,
    hashes,
  });
  collections.numberCollections++;

  writeCollections(osuPath, collections)
}
