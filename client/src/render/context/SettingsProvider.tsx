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
      toggleDarkMode(mode)
    });
  }, []);

  const toggleDarkMode = (on?: boolean) => {
    let newValue = !darkMode
    if (on !== undefined) newValue = on

    if (newValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setDarkMode(newValue)
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
