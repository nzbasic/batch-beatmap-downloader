import React, {
  useState, createContext, useEffect, PropsWithChildren,
} from 'react';
import { DownloadStatus } from '../../models/api';

export interface Downloads {
  downloads: DownloadStatus[]
}

const defaultContext: Downloads = {
  downloads: []
};

export const DownloadsContext = createContext<Downloads>(defaultContext);

const DownloadsProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [downloads, setDownloads] = useState<DownloadStatus[]>([])

  useEffect(() => {
    window.electron.getDownloadsStatus().then(res => setDownloads(res))
    window.electron.listenForDownloads2((status) => setDownloads(status))
  }, [])

  return (
    <DownloadsContext.Provider
      value={{ downloads }}
    >
      {children}
    </DownloadsContext.Provider>
  );
};

export default DownloadsProvider;
