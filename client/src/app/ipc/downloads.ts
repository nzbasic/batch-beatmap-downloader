import { beatmapIds } from '../beatmaps';
import { createDownload, deleteDownload, getDownloadsStatus, resumeDownload, resumeDownloads, pauseDownloads, pauseDownload as pause, convertStatus } from './../download/downloads';
import { E, serverUri } from './main';
import { currentQueryResult, currentDownloadDetails } from './query';
import { v4 as uuid } from 'uuid'
import axios from 'axios';
import { DownloadStartV2 } from '../../models/api-v2';
import { clientId } from '../download/settings';
import { getSongsFolder, getTempPath } from '../settings';
import fs from 'fs';
import path from 'path';

export const handleStartDownload = async (event: E, force: boolean, collectionName: string) => {
  const { totalSize, totalSizeForce } = currentDownloadDetails;
  const size = force ? totalSizeForce : totalSize;

  const id = currentQueryResult.Id
  const ids = currentQueryResult.SetIds.filter(setId => {
    if (force) return true;
    return !beatmapIds.has(setId);
  })

  await axios.post(`${serverUri}/v2/metrics/download/start`, {
    Client: clientId,
    Id: id,
    SizeRemoved: totalSizeForce - size,
  } as DownloadStartV2)

  const download = createDownload(id, ids, size, force, currentQueryResult.Hashes, collectionName)
  download.resume()
};

export const handleCreateDownload = (event: E, ids: number[], size: number, force: boolean, hashes: string[], collectionName: string) => {
  const id = uuid();
  const download = createDownload(id, ids, size, force, hashes, collectionName)
  download.resume()
}

export const handleGetDownloadsStatus = () => {
  return getDownloadsStatus().map(convertStatus);
};

export const handleResumeDownload = (event: E, downloadId: string) => resumeDownload(downloadId);
export const handleResumeDownloads = resumeDownloads;
export const handlePauseDownload = (event: E, downloadId: string) => pause(downloadId);
export const handlePauseDownloads = pauseDownloads;
export const handleDeleteDownload = (event: E, downloadId: string) => deleteDownload(downloadId);

export const handleMoveAllDownloads = async () => {
  const tempPath = await getTempPath();
  const songsPath = await getSongsFolder();



  // move all files in temp path to songs path
  const files = await fs.promises.readdir(tempPath);
  await Promise.all(files.map(file => fs.promises.rename(path.join(tempPath, file), path.join(songsPath, file))))
};
