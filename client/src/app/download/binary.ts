import log from 'electron-log';
import os from 'os';
import { app } from 'electron';
import Download from 'nodejs-file-downloader';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const generateChecksum = (path: string) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const input = fs.createReadStream(path);
    input.on('error', reject);
    input.on('data', (chunk) => {
      hash.update(chunk);
    });
    input.on('close', () => {
      resolve(hash.digest('hex'));
    });
  });
}

const downloadBinary = async (fileName: string, checksum: string) => {
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

  const calculated = await generateChecksum(binaryPath);
  if (calculated !== checksum) {
    fs.rmSync(binaryPath);
    log.error("Download binary checksum mismatch");
    throw new Error("Checksum mismatch");
  }

  fs.chmodSync(binaryPath, 0o755);
  return binaryPath;
}

const getBinaryAndHash = (platform: string, arch: string): [string, string] => {
  if (platform === "win32" && arch === 'x64') return ["download-windows-amd64.exe", "3aaa362e795acf7a5986dea555c4c617343c79ba154955c59445d40d4c9e7894"]
  if (platform === "win32" && arch === 'x32') return ["download-windows-386.exe", "9a99404d4c74c61c2f8ed1a47ba5b76ff8873b118c96c6a1b62ef4c7515f6e3f"]
  if (platform === "linux" && arch === 'x64') return ["download-linux-amd64", "198f8f946d0cc665947603222f81bbdfb1f4a1b93f95f025e3f43097a3a8a6ec"]
  if (platform === "linux" && arch === 'x32') return ["download-linux-386", "42ea1f97c7832eb3a512cca11b71aa4e69527b7fadcb1ba79c0d09ab68e27b98"]
  if (platform === "darwin" && arch === 'x64') return ["download-darwin-amd64", "1a51836663af154b5b315028c7a2c3982f792e987a5e995537ac666c56bb43c1"]
  if (platform === "darwin" && arch === 'x32') return ["download-darwin-386", "374e046aba93d90564bbce32c850534d29a46d48571c6b56772ff5d71df6bf8d"]
  log.error("Unsupported platform", platform, arch);
  throw new Error("Unsupported platform")
}

export const binaryPath = new Promise<string>((res) => {
  const platform = os.platform();
  const arch = os.arch();
  const [name, hash] = getBinaryAndHash(platform, arch);
  downloadBinary(name, hash).then(res)
});
