import { debounce } from 'lodash';
import React, {
  useState, createContext, useEffect, PropsWithChildren, useContext,
} from 'react';

export interface Settings {
  darkMode: boolean
  toggleDarkMode: (on?: boolean) => void

  path: string;
  setPath: (path: string) => void;
  altPathEnabled: boolean;
  setAltPathEnabled: (enabled: boolean) => void;
  altPath: string;
  setAltPath: (path: string) => void;
  maxConcurrentDownloads: number;
  setMaxConcurrentDownloads: (number: number) => void;

  validPath: boolean;
  beatmapSetCount: number;
}

const defaultContext: Settings = {
  darkMode: false,
  toggleDarkMode: () => null,
  path: "",
  setPath: () => null,
  altPathEnabled: false,
  setAltPathEnabled: () => null,
  altPath: "",
  setAltPath: () => null,
  maxConcurrentDownloads: 5,
  setMaxConcurrentDownloads: () => null,
  validPath: false,
  beatmapSetCount: 0,
};

export const SettingsContext = createContext<Settings>(defaultContext);

const SettingsProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [path, setPath] = useState("");
  const [altPath, setAltPath] = useState("")
  const [altPathEnabled, setAltPathEnabled] = useState(false)
  const [beatmapSetCount, setBeatmapSetCount] = useState(0);
  const [maxConcurrentDownloads, setMaxConcurrentDownloads] = useState(5)
  const [validPath, setValidPath] = useState(false)

  useEffect(() => {
    window.electron.getSettings().then((res) => {
      setValidPath(res.validPath as boolean ?? false)
      toggleDarkMode(res.darkMode as boolean ?? false)
      setPath(res.path as string ?? "");
      setAltPath(res.altPath as string ?? "")
      setMaxConcurrentDownloads(res.maxConcurrentDownloads as number ?? 5)
      setBeatmapSetCount(res.sets as number ?? 0)
      setAltPathEnabled(res.altPathEnabled as boolean ?? false)
    });
  }, []);

  const toggleDarkMode = (on?: boolean) => {
    let newValue = !darkMode
    if (on !== undefined) newValue = on
    document.documentElement.classList.toggle('dark', newValue)
    window.electron.setSetting("darkMode", newValue)
    setDarkMode(newValue)
  };

  const handleSetPath = async (path: string) => {
    setPath(path)
    const [valid, count] = await window.electron.setSetting("path", path)
    setValidPath(valid)
    setBeatmapSetCount(count)
  }

  const handleSetAltPath = async (path: string) => {
    setAltPath(path)
    const count = await window.electron.setSetting("altPath", path)
    setBeatmapSetCount(count)
  }

  const handleSetAltPathEnabled = async (enabled: boolean) => {
    setAltPathEnabled(enabled)
    const count = await window.electron.setSetting("altPathEnabled", enabled)
    setBeatmapSetCount(count)
  }

  const debouncedSetMaxConcurrentDownloads = debounce((value: number) => window.electron.setSetting("maxConcurrentDownloads", value), 500)

  const handleSetMaxConcurrentDownloads = (number: number) => {
    setMaxConcurrentDownloads(number)
    debouncedSetMaxConcurrentDownloads(number)
  }

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        path,
        setPath: handleSetPath,
        altPathEnabled,
        setAltPathEnabled: handleSetAltPathEnabled,
        altPath,
        setAltPath: handleSetAltPath,
        beatmapSetCount,
        maxConcurrentDownloads,
        setMaxConcurrentDownloads: handleSetMaxConcurrentDownloads,
        validPath
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext)

export default SettingsProvider;
