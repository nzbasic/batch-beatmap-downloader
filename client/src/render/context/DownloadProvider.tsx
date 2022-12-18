import React, {
  useState, createContext, useEffect, PropsWithChildren, useContext,
} from 'react';
import { DownloadStatus, ReportedDownloadStatus } from '../../models/api';

export interface Downloads {
  downloads: ReportedDownloadStatus[]
}

const defaultContext: Downloads = {
  downloads: []
};

export const DownloadsContext = createContext<Downloads>(defaultContext);

const DownloadsProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [downloads, setDownloads] = useState<ReportedDownloadStatus[]>([])

  useEffect(() => {
    window.electron.getDownloadsStatus().then(res => setDownloads(res.reverse()))
    window.electron.listenForDownloads((status) => setDownloads(status.reverse()))
  }, [])

  return (
    <DownloadsContext.Provider
      value={{ downloads }}
    >
      {children}
    </DownloadsContext.Provider>
  );
};

export const useDownload = () => useContext(DownloadsContext);

export default DownloadsProvider;
