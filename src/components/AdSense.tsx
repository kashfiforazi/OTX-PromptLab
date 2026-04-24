import React, { useEffect } from 'react';

// AdSense needs the script in the head, and then <ins> tags where ads show
export function AdSense({ client, slot, format = 'auto', responsive = 'true' }: { client: string; slot: string; format?: string; responsive?: string }) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
         style={{ display: 'block' }}
         data-ad-client={client}
         data-ad-slot={slot}
         data-ad-format={format}
         data-full-width-responsive={responsive}></ins>
  );
}
