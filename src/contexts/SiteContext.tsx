import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings, getSiteSettings } from '../services/api';

interface SiteContextType {
  settings: SiteSettings;
  loading: boolean;
}

const SiteContext = createContext<SiteContextType>({ settings: {}, loading: true });

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data) setSettings(data);
      setLoading(false);
    });
  }, []);

  return (
    <SiteContext.Provider value={{ settings, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
