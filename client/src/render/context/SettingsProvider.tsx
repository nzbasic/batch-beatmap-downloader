import { debounce } from 'lodash';
import React, {
  useState, createContext, useEffect, PropsWithChildren, useContext,
} from 'react';

interface SettingsObject {
  darkMode: boolean;
  path: string;
  altPath: string;
  altPathEnabled: boolean;
  beatmapSetCount: number;
  maxConcurrentDownloads: number;
  validPath: boolean;
  autoTransfer: boolean;
}

export interface Settings {
  settings: SettingsObject

  toggleDarkMode: (on?: boolean) => void
  setPath: (path: string) => void;
  setAltPathEnabled: (enabled: boolean) => void;
  setAltPath: (path: string) => void;
  setMaxConcurrentDownloads: (number: number) => void;
}

const defaultContext: Settings = {
  settings: {
    darkMode: true,
    path: "",
    altPath: "",
    altPathEnabled: false,
    beatmapSetCount: 0,
    maxConcurrentDownloads: 5,
    validPath: false,
    autoTransfer: false,
  },

  toggleDarkMode: () => null,
  setPath: () => null,
  setAltPathEnabled: () => null,
  setAltPath: () => null,
  setMaxConcurrentDownloads: () => null,
};

export const SettingsContext = createContext<Settings>(defaultContext);

const SettingsProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [settings, setSettings] = useState(defaultContext.settings)

  useEffect(() => {
    window.electron.getSettings().then((res) => {
      setSettings({
        darkMode: res.darkMode as boolean ?? true,
        path: res.path as string ?? "",
        altPath: res.altPath as string ?? "",
        altPathEnabled: res.altPathEnabled as boolean ?? false,
        beatmapSetCount: res.sets as number ?? 0,
        maxConcurrentDownloads: res.maxConcurrentDownloads as number ?? 5,
        validPath: res.validPath as boolean ?? false,
        autoTransfer: res.autoTransfer as boolean ?? false,
      })

      document.documentElement.classList.toggle('dark', res.darkMode as boolean ?? true);
    })
  }, []);

  const toggleDarkMode = (on?: boolean) => {
    let newValue = !settings.darkMode
    if (on !== undefined) newValue = on
    document.documentElement.classList.toggle('dark', newValue)
    window.electron.setSetting("darkMode", newValue)
    setSettings(prev => ({ ...prev, darkMode: newValue }))
  };

  const handleSetPath = async (path: string) => {
    const [validPath, beatmapSetCount] = await window.electron.setSetting("path", path)
    setSettings(prev => ({
      ...prev,
      path,
      validPath,
      beatmapSetCount
    }))
  }

  const handleSetAltPath = async (path: string) => {
    const beatmapSetCount = await window.electron.setSetting("altPath", path)
    setSettings(prev => ({
      ...prev,
      altPath: path,
      beatmapSetCount
    }))
  }

  const handleSetAltPathEnabled = async (enabled: boolean) => {
    const beatmapSetCount = await window.electron.setSetting("altPathEnabled", enabled)
    setSettings(prev => ({
      ...prev,
      altPathEnabled: enabled,
      beatmapSetCount
    }))
  }

  const debouncedSetMaxConcurrentDownloads = debounce((value: number) => window.electron.setSetting("maxConcurrentDownloads", value), 500)

  const handleSetMaxConcurrentDownloads = (number: number) => {
    debouncedSetMaxConcurrentDownloads(number)
    setSettings(prev => ({
      ...prev,
      maxConcurrentDownloads: number
    }))
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        toggleDarkMode,
        setPath: handleSetPath,
        setAltPathEnabled: handleSetAltPathEnabled,
        setAltPath: handleSetAltPath,
        setMaxConcurrentDownloads: handleSetMaxConcurrentDownloads,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext)

export default SettingsProvider;
