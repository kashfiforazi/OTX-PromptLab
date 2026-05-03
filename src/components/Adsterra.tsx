import React, { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AdsterraProps {
  scriptHtml: string;
  showPlaceholder?: boolean;
  label?: string;
}

export function Adsterra({ scriptHtml, showPlaceholder = false, label = "Advertisement" }: AdsterraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!scriptHtml || !containerRef.current) return;

    // Clear previous contents
    containerRef.current.innerHTML = '';
    isLoaded.current = false;

    try {
      const div = document.createElement('div');
      div.innerHTML = scriptHtml;
      
      const scripts = div.querySelectorAll('script');
      
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        if (oldScript.src) {
          newScript.src = oldScript.src;
          newScript.async = true;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        
        containerRef.current?.appendChild(newScript);
      });

      // Append non-script elements
      Array.from(div.childNodes).forEach(node => {
        if (node.nodeName !== 'SCRIPT') {
          containerRef.current?.appendChild(node.cloneNode(true));
        }
      });

      isLoaded.current = true;
    } catch (err) {
      console.error('Error loading Adsterra ad:', err);
    }
  }, [scriptHtml]);

  if (!scriptHtml && !isAdmin) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center my-4">
      {label && (
        <div className="text-center mb-2">
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 dark:text-gray-500">{label}</span>
        </div>
      )}
      <div 
        ref={containerRef} 
        className={`w-full flex justify-center min-h-[50px] relative ${isAdmin && !scriptHtml ? 'border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-8' : ''}`}
      >
        {isAdmin && !scriptHtml && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-400">Adsterra Slot (Empty)</span>
            <span className="text-[9px] text-gray-400 italic font-mono text-center">Add script in Admin Panel</span>
          </div>
        )}
      </div>
    </div>
  );
}
