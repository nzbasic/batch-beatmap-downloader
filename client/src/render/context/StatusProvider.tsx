import React, {
  useState, createContext, useEffect, PropsWithChildren, useContext,
} from 'react';
import { MetricsV2 } from '../../models/metrics';

export interface Status {
  online: boolean
  metrics: MetricsV2 | null
  loading: boolean
}

const defaultContext: Status = {
  online: false,
  metrics: null,
  loading: true
};

export const StatusContext = createContext<Status>(defaultContext);

const StatusProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false)
  const [metrics, setMetrics] = useState<MetricsV2 | null>(null)

  const collectMetrics = () => {
    window.electron.getMetrics().then(([online, data]) => {
      setOnline(online);
      setMetrics(data);
      setLoading(false)
    });
  };

  useEffect(() => {
    collectMetrics();
    const interval = setInterval(() => collectMetrics(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StatusContext.Provider
      value={{ online, metrics, loading }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => useContext(StatusContext)

export default StatusProvider;
