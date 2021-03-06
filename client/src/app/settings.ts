import settings from "electron-settings";

export const getSongsFolder = async () => {
  const altPath = await settings.get("altPath") as string
  if (!altPath) {
    return (await settings.get("path") as string) + "/Songs"
  }

  return altPath
}
