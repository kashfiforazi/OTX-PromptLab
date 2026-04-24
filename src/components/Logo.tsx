import { Globe, Code } from 'lucide-react';
import { cn } from '../lib/utils';

export function Logo({ className, showWordmark = true }: { className?: string, showWordmark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex items-center justify-center shrink-0">
        {/* Core sphere */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[0_0_15px_rgba(37,99,235,0.6)] dark:shadow-[0_0_20px_rgba(37,99,235,0.8)] border-2 border-blue-300">
          <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute inset-0 m-auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-full pointer-events-none" />
        </div>
        
        {/* Ring */}
        <div className="absolute w-[160%] h-[40%] border-2 border-blue-400 rounded-[100%] rotate-[-20deg] opacity-80 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(96,165,250,0.5)] z-[-1]" />
        <div className="absolute w-[160%] h-[40%] border-t-2 border-blue-300 rounded-[100%] rotate-[-20deg] opacity-90 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-display font-bold tracking-tighter leading-none dark:text-gray-100 text-gray-900 flex items-center gap-1.5">
            <span>PROMPT</span>
            <span className="text-blue-600 dark:text-blue-500">LAB</span>
          </h1>
          <span className="text-[8px] sm:text-[9px] font-black tracking-[0.3em] text-blue-600/80 dark:text-blue-400/80 uppercase mt-0.5 ml-0.5">Oentrix</span>
        </div>
      )}
    </div>
  );
}
