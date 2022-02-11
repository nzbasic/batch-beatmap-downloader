import {
  ipcRenderer,
  contextBridge,
  shell,
  OpenExternalOptions,
} from "electron";
import { createStoreBindings } from "electron-persist-secure/lib/bindings";

export const electronBridge = {
  quit: (): void => {
    ipcRenderer.send("quit-app");
  },

  minimize: (): void => {
    ipcRenderer.send("minimize-app");
  },

  maximize: (): void => {
    ipcRenderer.send("maximize-app");
  },

  relaunch: (): void => {
    ipcRenderer.send("relaunch-app");
  },

  openUrl: async (
    url: string,
    options?: OpenExternalOptions
  ): Promise<void> => {
    return await shell.openExternal(url, options);
  },

  openPath: async (path: string): Promise<string> => {
    return await shell.openPath(path);
  },
};

contextBridge.exposeInMainWorld("electron", electronBridge);

export const storeBridge = createStoreBindings("config"); // "config" = the stores name

contextBridge.exposeInMainWorld("store", {
  ...storeBridge,
});
