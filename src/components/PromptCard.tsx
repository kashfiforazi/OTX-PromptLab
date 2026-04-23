import { useState } from 'react';
import { Copy, Plus, Play, Sparkles, Check, ExternalLink } from 'lucide-react';
import { Prompt } from '../types';
import { incrementCopies, incrementViews } from '../services/api';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface Props {
  prompt: Prompt;
  onClick?: () => void;
}

export function PromptCard({ prompt, onClick }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      await incrementCopies(prompt.id!);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCardClick = () => {
    incrementViews(prompt.id!).catch(console.error);
    if (onClick) onClick();
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 flex flex-col rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300"
      onClick={handleCardClick}
    >
      {prompt.mediaUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-black">
          {prompt.mediaUrl.match(/\.(mp4|webm)$/i) ? (
            <video src={prompt.mediaUrl} autoPlay muted loop className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <img
              src={prompt.mediaUrl}
              alt={prompt.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${prompt.id}/400/300`;
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
          <div className="absolute bottom-2 left-2 flex gap-2">
            <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {prompt.category}
            </span>
            {prompt.isTrending && (
              <span className="rounded-full bg-blue-500/80 border border-blue-400 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Trending
              </span>
            )}
          </div>
        </div>
      )}

      <div className={cn("flex flex-1 flex-col p-5", !prompt.mediaUrl && "pt-6")}>
        {!prompt.mediaUrl && (
          <div className="mb-4 flex gap-2">
             <span className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-white/10 rounded uppercase font-bold text-gray-700 dark:text-white tracking-widest border border-gray-200 dark:border-white/5">
               {prompt.category}
             </span>
             {prompt.isTrending && (
              <span className="text-[10px] px-2 py-1 bg-blue-50 dark:bg-blue-500/20 rounded uppercase font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40 flex items-center gap-1">
                Trending
              </span>
            )}
          </div>
        )}
        <h4 className="font-bold mb-1 tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {prompt.title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {prompt.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500 font-mono tracking-widest uppercase">
            <span>{prompt.viewCount}V</span>
            <span>{prompt.copyCount}C</span>
          </div>

          <button
            onClick={handleCopy}
            className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center"
          >
            {copied ? <Check className="mr-1 h-3 w-3" /> : null}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
