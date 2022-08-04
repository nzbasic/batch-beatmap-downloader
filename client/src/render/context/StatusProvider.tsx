import React, {
  useState, createContext, useEffect, PropsWithChildren,
} from 'react';
import { Metrics } from '../../models/metrics';

export interface Status {
  online: boolean
  metrics: Metrics | null
}

const defaultContext: Status = {
  online: false,
  metrics: null
};

export const StatusContext = createContext<Status>(defaultContext);

const StatusProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [online, setOnline] = useState(false)
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    window.electron.getMetrics().then(([online, data]) => {
      setOnline(online)
      setMetrics(data)
    })
  }, []);

  return (
    <StatusContext.Provider
      value={{ online, metrics }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export default StatusProvider;
