import { electronBridge, storeBridge } from "../main";

declare global {
  interface Window {
    electron: typeof electronBridge;
    store: typeof storeBridge;
  }
}
