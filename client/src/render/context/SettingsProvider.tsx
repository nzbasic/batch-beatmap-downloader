import React, {
  useState, createContext, useEffect, PropsWithChildren,
} from 'react';

export interface Settings {
  darkMode: boolean
  toggleDarkMode: (on?: boolean) => void
}

const defaultContext: Settings = {
  darkMode: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleDarkMode: () => {}
};

export const SettingsContext = createContext<Settings>(defaultContext);

const SettingsProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    window.electron.getSettings().then((res) => {
      const mode = res.darkMode as boolean;
      setDarkMode(mode)
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.electron.setTheme(darkMode)
  }, [darkMode])

  const toggleDarkMode = (on?: boolean) => {
    if (on !== undefined) setDarkMode(on);
    else setDarkMode(prev => !prev)
  }

  return (
    <SettingsContext.Provider
      value={{ darkMode, toggleDarkMode }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
