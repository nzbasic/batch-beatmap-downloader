import axios from "axios";
import { DownloadStatus } from "../../models/api";
import { serverUri } from "../ipc/main";
import { shouldBeClosed, window } from "../../main";
import Download from "nodejs-file-downloader";
import { getMaxConcurrentDownloads, getSongsFolder } from "../settings";
import { v4 as uuidv4 } from 'uuid'
import { loadBeatmaps } from "../beatmaps";
import { setDownloadStatus } from "./settings";
import { addCollection } from "../collection/collection";
import { emitStatus } from "./downloads";

enum Status {
  FINISHED,
  PAUSED,
  ERROR
}

export class DownloadController {
  private ids: number[] = [];
  private size: number = 0;
  private force: boolean = false;
  private hashes: string[] = [];
  private status: DownloadStatus

  private concurrentDownloads: number = 3
  private id: string = uuidv4()
  private toDownload: number[] = []

  public constructor(ids: number[], size: number, force: boolean, hashes: string[]) {
    this.ids = ids
    this.size = size;
    this.force = force;
    this.hashes = hashes;

    this.status = {
      id: this.id,
      paused: true,
      all: ids,
      completed: [],
      failed: [],
      skipped: [],
      currentProgress: "0",
      currentSize: "0",
      totalSize: size,
      totalProgress: 0,
      force: force,
    };
  }

  public getId() {
    return this.id
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
    this.id = uuidv4()
    this.status.paused = false
    emitStatus()

    this.concurrentDownloads = await getMaxConcurrentDownloads()

    await this.postData(`${serverUri}/metrics/downloadStart`, {
      downloadId: this.id,
      ids: this.ids,
      size: this.size,
      force: this.force
    })

    const beatmapIds = await loadBeatmaps();
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
      const hasMap = beatmapIds.includes(id)
      if (hasMap) skipped.push(id)
      return !hasMap
    })

    if (!this.status.skipped.length) this.status.skipped = skipped

    const downloads: Promise<Status | (() => Promise<void>)>[] = []
    for (let i = 0; i < this.concurrentDownloads; i++) {
      downloads.push(this.downloadBeatmapSet())
    }

    const results = await Promise.all(downloads)

    for (const result of results) {
      if (result === Status.FINISHED) {
        // this prevents failed downloads not adding to the progress bar
        this.status.totalProgress = this.status.totalSize;
        emitStatus()
      }
    }

    await setDownloadStatus(this.id, this.status)
    await this.postData(`${serverUri}/metrics/downloadEnd`, { downloadId: this.id })
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

  public pause() {
    this.status.paused = true
    emitStatus()
    this.postData(`${serverUri}/metrics/downloadEnd`, { id: this.id })
  }

  private handleServerError(err: Error) {
    if (err.message.includes("502")) {
      this.pause()
      window?.webContents.send("error", "Server is down");
      window?.webContents.send("server-down", true)

      const interval = setInterval(() => {
        axios.get(serverUri).then(res => {
          if (res.status >= 200 && res.status <= 299) {
            window?.webContents.send("server-down", false)
            this.resume()
            clearInterval(interval)
          }
        })
      }, 1000)
    }
  }

  private getNextSetId() {
    return this.toDownload.shift()
  }

  private async downloadBeatmapSet(): Promise<Status | (() => Promise<void>)> {
    if (shouldBeClosed) return Status.PAUSED
    if (this.status.paused) return Status.PAUSED

    const setId = this.getNextSetId()
    if (setId === undefined) return Status.FINISHED

    console.log(`${this.id} downloading ${setId}`)

    const uri = `${serverUri}/beatmapset/${setId}`;
    let cancelled = false
    let size = 0

    const path = await getSongsFolder();
    const download = new Download({
      url: uri,
      directory: path,
      maxAttempts: 3,
      onResponse: (r) => {
        const rSize = r.headers["content-length"] ?? "0"
        size = parseInt(rSize);
        if (this.status.paused) {
          download.cancel()
          cancelled = true
        }
      },
    })

    try {
      const before = new Date();
      await download.download();
      const after = new Date();
      const difference = after.getTime() - before.getTime();

      const downloadStats: { time: number, size: number }[] = this.status.currentDownloads??[]
      if (downloadStats.length == this.concurrentDownloads) {
        downloadStats.shift()
      }

      downloadStats.push({
        time: difference,
        size
      })

      let totalDownloadSpeed = 0
      for (const downloadStat of downloadStats) {
        const size = downloadStat.size * 8 / 1000 / 1000
        const time = downloadStat.time / 1000
        totalDownloadSpeed += (size / time)
      }

      await this.postData(`${serverUri}/metrics/beatmapDownload`, {
        downloadId: this.id,
        setId,
        size,
        time: difference,
        totalDownloadSpeed
      });

      this.status.currentDownloads = downloadStats
      this.status.lastDownloadTime = difference
      this.status.lastDownloadSize = size
      this.status.completed.push(setId);
      this.status.totalProgress += size;
    } catch (err) {
      if (!cancelled) {
        this.status.failed.push(setId);
        this.status.totalProgress += size;

        if (err instanceof Error) {
          this.handleServerError(err)
        }
      }
    }

    emitStatus()
    await setDownloadStatus(this.id, this.status)

    return this.downloadBeatmapSet()
  }
}
