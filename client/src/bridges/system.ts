import {
  ipcRenderer,
  shell,
  OpenExternalOptions,
} from "electron";

export const handleBrowse = () => ipcRenderer.invoke("browse") as Promise<Electron.OpenDialogReturnValue>;
export const handleOpenUrl = (url: string, options?: OpenExternalOptions) => shell.openExternal(url, options);
export const handleQuit = () => ipcRenderer.send("quit");
export const handleListenForErrors = (callback: (error: string) => void) => {
  ipcRenderer.on("error", (event, error: string) => {
    callback(error);
  });
};

export const handleListenForServerDown = (callback: (down: boolean) => void) => {
  ipcRenderer.on("server-down", (event, down: boolean) => {
    callback(down);
  });
};
