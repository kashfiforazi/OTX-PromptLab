import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdsSettings, getAdsSettings } from '../services/api';

const AdsContext = createContext<{ settings: AdsSettings | null }>({ settings: null });

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AdsSettings | null>(null);

  useEffect(() => {
    getAdsSettings().then(data => {
      setSettings(data);
      if (data?.enabled) {
        // Google AdSense
        if (data?.googleAdClient) {
          if (!document.querySelector(`script[src*="adsbygoogle.js"]`)) {
            const script = document.createElement('script');
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${data.googleAdClient}`;
            script.async = true;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
          }
        }

        // Adsterra Global Scripts (Popunder/Social Bar)
        // These are often provided as full script tags. We parse them or inject them as script elements.
        const injectScript = (id: string, code: string) => {
          if (!code) return;
          if (document.getElementById(id)) return;
          
          const div = document.createElement('div');
          div.id = id;
          div.innerHTML = code;
          
          // Extract scripts and append them to head
          const scripts = div.getElementsByTagName('script');
          for (let i = 0; i < scripts.length; i++) {
            const s = document.createElement('script');
            const original = scripts[i];
            if (original.src) {
              s.src = original.src;
              s.async = true;
            } else {
              s.textContent = original.textContent;
            }
            document.head.appendChild(s);
          }
        };

        if (data.adsterraPopunderCode) injectScript('adsterra-popunder', data.adsterraPopunderCode);
        if (data.adsterraSocialBarCode) injectScript('adsterra-socialbar', data.adsterraSocialBarCode);
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
