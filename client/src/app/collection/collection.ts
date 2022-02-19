import settings from "electron-settings";
import { cloneDeep } from "lodash";
import { readCollections, writeCollections } from "./parse";
import { window } from '../../main'

export const addCollection = async (hashes: string[], name: string) => {
  const osuPath = await settings.get("path") as string;
  const backup = await readCollections(osuPath)
  const newCollections = cloneDeep(backup)

  newCollections.collections.push({
    name,
    numberMaps: hashes.length,
    hashes,
  });
  newCollections.numberCollections++;
  await writeCollections(osuPath, newCollections)

  const testWrite = await readCollections(osuPath)

  // some unreproducible write error occurred at one point which caused garbage values to be written to disk
  if (testWrite.numberCollections !== newCollections.numberCollections) {
    window.webContents.send("error", "Something went wrong when creating the new collection. Backup was restored.")
    await writeCollections(osuPath, backup)
  }
}
