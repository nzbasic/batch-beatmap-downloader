import settings from "electron-settings";
import fs from 'fs';

export const checkValidPath = async (path: string) => {
  try {
    const files = await fs.promises.readdir(path);
    if (!files.includes("collection.db")) {
      return false;
    }
  } catch(err) {
    return false;
  }

  return true
};

export const getSongsFolder = async () => {
  const altPath = await settings.get("altPath") as string
  if (!altPath) {
    return (await settings.get("path") as string) + "/Songs"
  }

  return altPath
}

export const getMaxConcurrentDownloads = async () => {
  return (await settings.get("maxConcurrentDownloads") as number)??3
}
