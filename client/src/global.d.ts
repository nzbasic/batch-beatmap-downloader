import { electronBridge, storeBridge } from "./bridges/main";

declare global {
  interface Window {
    electron: typeof electronBridge;
    store: typeof storeBridge;
  }
}

declare type SettingsValue = null | boolean | string | number | SettingsObject | SettingsValue[];
/**
 * A `SettingsObject` is an object whose property values
 * are of the type `SettingsValue`.
 */
declare type SettingsObject = {
    [key: string]: SettingsValue;
};
