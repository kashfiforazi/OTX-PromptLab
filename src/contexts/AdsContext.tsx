import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdsSettings, getAdsSettings } from '../services/api';

const AdsContext = createContext<{ settings: AdsSettings | null }>({ settings: null });

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AdsSettings | null>(null);

  useEffect(() => {
    getAdsSettings().then(data => {
      setSettings(data);
      if (data?.enabled && data?.googleAdClient) {
        // Inject script into head if not already there
        if (!document.querySelector(`script[src*="adsbygoogle.js"]`)) {
          const script = document.createElement('script');
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${data.googleAdClient}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }
      }
    });
  }, []);

  return (
    <AdsContext.Provider value={{ settings }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  return useContext(AdsContext);
}
