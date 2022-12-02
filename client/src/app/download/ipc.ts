import { binaryPath } from './binary';
import IPC from 'ipc-node-go';

interface DownloadResponse {
  Size: number;
  Failed: boolean;
}

interface DownloadRequest {
	index: number;
  setId: string;
  out: string;
}

export class DownloadIPC {
  private binary = new Promise<void>((res) => {
    binaryPath.then(() => res())
  });

  private ipc: IPC;
  private queue: DownloadRequest[] = [];
  private available = true;

  constructor() {
    binaryPath.then(path => {
      this.ipc = new IPC(path);
      this.ipc.on('log', console.log)
      this.ipc.on('available', () => {
        const request = this.queue.shift();
        if (!request) return this.available = true;
        this.ipc.send('download', request);
      })

      this.ipc.init();
    })
  }

  public async download(setId: string, out: string, index = 0) {
    const request: DownloadRequest = {
      setId,
      out,
      index
    }

    await this.binary;

    if (this.available) {
      this.available = false;
      this.ipc.send('download', request);
    } else {
      this.queue.push(request);
    }

    return new Promise<DownloadResponse>((res, rej) => {
      this.ipc.on(setId, (data, err) => {
        if (err) rej(err)
        res(data as DownloadResponse);
      })
    })
  }
}
