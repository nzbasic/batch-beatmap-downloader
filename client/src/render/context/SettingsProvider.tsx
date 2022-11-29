import React, {
  useState, createContext, useEffect, PropsWithChildren, useContext,
} from 'react';

export interface Settings {
  darkMode: boolean
  toggleDarkMode: (on?: boolean) => void

  path: string;
  setPath: (path: string) => void;
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
  altPath: "",
  setAltPath: () => null,
  maxConcurrentDownloads: 3,
  setMaxConcurrentDownloads: () => null,
  validPath: false,
  beatmapSetCount: 0,
};

export const SettingsContext = createContext<Settings>(defaultContext);

const SettingsProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [path, setPath] = useState("");
  const [altPath, setAltPath] = useState("")
  const [beatmapSetCount, setBeatmapSetCount] = useState(0);
  const [maxConcurrentDownloads, setMaxConcurrentDownloads] = useState(3)
  const [validPath, setValidPath] = useState(false)

  useEffect(() => {
    window.electron.getSettings().then((res) => {
      setValidPath(res.validPath as boolean)
      toggleDarkMode(res.darkMode as boolean)
      setPath(res.path as string);
      setAltPath(res.altPath as string)
      setMaxConcurrentDownloads(res.maxConcurrentDownloads as number)
      setBeatmapSetCount(res.sets as number)
    });
  }, []);

  const toggleDarkMode = (on?: boolean) => {
    let newValue = !darkMode
    if (on !== undefined) newValue = on
    document.documentElement.classList.toggle('dark', newValue)
    setDarkMode(newValue)
  };

  const handleSetPath = async (path: string) => {
    setPath(path)
    const [valid, count] = await window.electron.setPath(path)
    setValidPath(valid)
    setBeatmapSetCount(count)
  }

  const handleSetAltPath = async (path: string) => {
    setAltPath(path)
    const count = await window.electron.setAltPath(path)
    setBeatmapSetCount(count)
  }

  const handleSetMaxConcurrentDownloads = (number: number) => {
    setMaxConcurrentDownloads(number)
    window.electron.setMaxConcurrentDownloads(number)
  }

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        path,
        setPath: handleSetPath,
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
