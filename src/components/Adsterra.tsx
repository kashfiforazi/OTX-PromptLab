import React, { useEffect, useRef } from 'react';

interface AdsterraProps {
  code?: string;
  showPlaceholder?: boolean;
}

export function Adsterra({ code, showPlaceholder = false }: AdsterraProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && code) {
      // Clear existing content
      containerRef.current.innerHTML = '';
      
      // Some Adsterra codes contain <script> tags. We need to manually execute them.
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = code;
      
      const scripts = Array.from(tempDiv.getElementsByTagName('script'));
      
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        
        // We append to the container
        containerRef.current?.appendChild(newScript);
      });

      // Handle non-script parts (like <ins> or <div>)
      Array.from(tempDiv.childNodes).forEach((node) => {
        if (node.nodeName !== 'SCRIPT') {
          containerRef.current?.appendChild(node.cloneNode(true));
        }
      });
    }
  }, [code]);

  if (!code && !showPlaceholder) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden relative min-h-[90px]">
      {showPlaceholder && !code && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Adsterra Ad Slot</span>
        </div>
      )}
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}
