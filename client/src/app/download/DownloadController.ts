import { BeatmapDownloadV2, DownloadUpdateV2 } from './../../models/api-v2';
import axios from "axios";
import { DownloadStatus } from "../../models/api";
import { serverUri } from "../ipc/main";
import { shouldBeClosed, window } from "../../main";
import { getMaxConcurrentDownloads, getSongsFolder } from "../settings";
import { beatmapIds, loadBeatmaps } from "../beatmaps";
import { clientId, setDownloadStatus } from "./settings";
import { addCollection } from "../collection/collection";
import { emitStatus } from "./downloads";
import { DownloadIPC } from './ipc';

enum Status {
  FINISHED,
  PAUSED,
  ERROR
}

export class DownloadController {
  private ids: number[] = [];
  private force: boolean = false;
  private hashes: string[] = [];
  private status: DownloadStatus;
  private startTime: Date;
  private downloadedSinceResume = 0;

  private concurrentDownloads: number = 3;
  private id: string;
  private toDownload: number[] = [];
  private interval: NodeJS.Timer;
  private ipc: DownloadIPC;

  public constructor(id: string, ids: number[], size: number, force: boolean, hashes: string[]) {
    this.id = id;
    this.ids = ids
    this.force = force;
    this.hashes = hashes;

    this.status = {
      id,
      paused: true,
      all: ids,
      completed: [],
      failed: [],
      skipped: [],
      totalSize: size,
      totalProgress: 0,
      force: force,
      speed: 0,
    };
  }

  public getId() {
    return this.id
  }

  public getIds() {
    return this.ids
  }

  public async createCollection(collectionName: string) {
    await addCollection(this.hashes, collectionName);
  }

  public setStatus(status: DownloadStatus): void {
    this.status = status;
  }

  public getStatus(): DownloadStatus {
    return this.status;
  }

  public setConcurrentDownloads(number: number) {
    this.concurrentDownloads = number;
  }

  public async resume() {
    this.ipc = new DownloadIPC();
    this.startTime = new Date();
    this.downloadedSinceResume = 0;
    this.status.paused = false
    emitStatus()

    this.concurrentDownloads = await getMaxConcurrentDownloads()
    this.updateDownload("resume")

    await loadBeatmaps();
    const newIds = this.ids.filter((id) => {
      return (
        !this.status.completed.includes(id) &&
        !this.status.skipped.includes(id) &&
        !this.status.failed.includes(id)
      );
    });

    const skipped: number[] = []
    this.toDownload = newIds.filter(id => {
      if (this.force) return true;
      const hasMap = beatmapIds.has(id)
      if (hasMap) skipped.push(id)
      return !hasMap
    })

    if (!this.status.skipped.length) this.status.skipped = skipped

    const downloads: Promise<Status | (() => Promise<void>)>[] = []
    for (let i = 0; i < this.concurrentDownloads; i++) {
      downloads.push(this.downloadBeatmapSet(i))
    }

    const results = await Promise.all(downloads)

    for (const result of results) {
      if (result === Status.FINISHED) {
        // this prevents failed downloads not adding to the progress bar
        this.status.totalProgress = this.status.totalSize;
        emitStatus()
      }
    }

    if (!this.status.paused) this.updateDownload("delete")
    await setDownloadStatus(this.id, this.status)
    this.ipc.close();
  }

  private async postData(url: string, body: unknown) {
    try {
      await axios.post(url, body);
    } catch(err) {
      if (err instanceof Error) {
        this.handleServerError(err)
      }
    }
  }

  public updateDownload(type: DownloadUpdateV2['Type']) {
    this.postData(`${serverUri}/v2/metrics/download/update`, {
      Client: clientId,
      Id: this.id,
      Type: type,
    } as DownloadUpdateV2)
  }

  public pause() {
    this.status.paused = true
    emitStatus()
    this.updateDownload("pause")
    this.ipc.close();
  }

  public getDownloadSpeed() {
    const elapsed = new Date().getTime() - this.startTime.getTime();
    return (this.downloadedSinceResume / 1024 / 1024) / (elapsed / 1000);
  }

  private handleServerError(err: Error) {
    if (err.message.includes("502")) {
      this.pause()
      window?.webContents.send("error", "Server is down");
      window?.webContents.send("server-down", true)

      this.interval = setInterval(() => {
        axios.get(`${serverUri}/api`).then(res => {
          if (res.status >= 200 && res.status <= 299) {
            window?.webContents.send("server-down", false)
            this.resume()
            clearInterval(this.interval)
          }
        })
      }, 1000)
    }
  }

  private getNextSetId() {
    return this.toDownload.shift()
  }

  private async downloadBeatmapSet(index: number): Promise<Status | (() => Promise<void>)> {
    if (shouldBeClosed) return Status.PAUSED
    if (this.status.paused) return Status.PAUSED

    const setId = this.getNextSetId()
    if (setId === undefined) return Status.FINISHED
    const path = await getSongsFolder()

    try {
      const before = new Date();
      const res = await this.ipc.download(setId.toString(), path, index)
      const after = new Date();
      const difference = after.getTime() - before.getTime();

      beatmapIds.add(setId);
      this.status.completed.push(setId);
      this.status.totalProgress += res.Size;
      this.downloadedSinceResume += res.Size

      const speed = this.getDownloadSpeed()
      this.status.speed = speed

      this.postData(`${serverUri}/v2/metrics/download/beatmap`, {
        Client: clientId,
        Id: this.id,
        SetId: setId.toString(),
        Time: difference / Math.max(this.concurrentDownloads, 1)
      } as BeatmapDownloadV2);
    } catch (err) {
      console.log(setId, 'failed')
      this.status.failed.push(setId);

      if (err instanceof Error) {
        this.handleServerError(err)
      }
    }

    emitStatus()
    return this.downloadBeatmapSet(index)
  }
}
