import os from 'os';
import { app } from 'electron';
import Download from 'nodejs-file-downloader';
import fs from 'fs';
import path from 'path';

const downloadBinary = async (fileName: string) => {
  const appPath = app.getPath("userData");
  const binaryPath = path.join(appPath, fileName);
  const exists = fs.existsSync(binaryPath);
  if (exists) return binaryPath

  // download from uri to app path
  const dl = new Download({
    url: `https://direct.nzbasic.com/${fileName}`,
    directory: appPath,
    fileName,
  })

  await dl.download();

  return binaryPath;
}

const loadDownloadBinaryLinux = async () => {
  if (os.arch() !== "x64") return ""
  const path = await downloadBinary("download")
  fs.chmodSync(path, 0o755);
  return path;
}

const loadDownloadBinaryWindows = async () => {
  if (os.arch() !== "x64") return ""
  return await downloadBinary("download.exe");
}

export const binaryPath = new Promise<string>((res) => {
  const platform = os.platform();
  if (platform === 'win32') loadDownloadBinaryWindows().then(res)
  if (platform === 'linux') loadDownloadBinaryLinux().then(res)
});
