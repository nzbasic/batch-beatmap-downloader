import settings from "electron-settings";
import { cloneDeep } from "lodash";
import { readCollections, writeCollections } from "./parse";
import { window } from '../../main'
import axios from "axios";
import { serverUri } from "../ipc/main";
import { BeatmapHashMap } from "../../models/api";
import { loadBeatmaps } from "../beatmaps";

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

export const checkCollections = async () => {
  const osuPath = await settings.get("path") as string;
  const collections = await readCollections(osuPath)

  const collectionMapHashes = new Set<string>()

  for (const collection of collections.collections) {
    for (const hash of collection.hashes) {
      collectionMapHashes.add(hash)
    }
  }

  const data = (await axios.get<BeatmapHashMap>(`${serverUri}/hashMap`)).data
  const serverHashes = new Map<string, number>(Object.entries(data))
  const missing: number[] = []

  const ownedSetIds = new Set(await loadBeatmaps())

  collectionMapHashes.forEach(hash => {
    if (serverHashes.has(hash)) {
      const setId = serverHashes.get(hash);

      if (setId && !ownedSetIds.has(setId)) {
        missing.push(setId)
      }
    }
  })

  const totalSize = (await axios.post<number>(`${serverUri}/totalSize`, missing)).data
  return { ids: missing, totalSize }
}
