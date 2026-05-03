import React, { useEffect, useRef } from 'react';

// AdSense needs the script in the head, and then <ins> tags where ads show
export function AdSense({ client, slot, format = 'auto', responsive = 'true', showPlaceholder = false }: { client: string; slot: string; format?: string; responsive?: string; showPlaceholder?: boolean }) {
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    const pushAd = () => {
      if (typeof window !== "undefined" && adRef.current && !isPushed.current) {
        if (adRef.current.offsetWidth === 0) {
           setTimeout(pushAd, 200);
           return;
        }
        isPushed.current = true;
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        } catch (err) {
          // Ignore adsbygoogle errors
        }
      }
    };
    pushAd();
  }, [client, slot]);

  return (
    <div className={`w-full flex justify-center overflow-hidden relative ${showPlaceholder ? 'min-h-[100px]' : ''}`}>
      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Google AdSense Slot ({slot})</span>
        </div>
      )}
      <ins className="adsbygoogle"
           ref={adRef}
           style={{ display: 'block', width: '100%', minHeight: showPlaceholder ? '90px' : '0px', position: 'relative', zIndex: 1 }}
           data-ad-client={client}
           data-ad-slot={slot}
           data-ad-format={format}
           data-full-width-responsive={responsive}></ins>
    </div>
  );
}
