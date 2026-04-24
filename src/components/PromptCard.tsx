import React, { useState } from 'react';
import { Copy, Plus, Play, Sparkles, Check, ExternalLink, Share2 } from 'lucide-react';
import { Prompt } from '../types';
import { incrementCopies, incrementViews } from '../services/api';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { SaveButton } from './SaveButton';

interface Props {
  prompt: Prompt;
  onClick?: () => void;
}

export const PromptCard: React.FC<Props> = ({ prompt, onClick }) => {
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

  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(window.location.origin + '/prompt/' + prompt.id);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {}
  };

  return (
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 flex flex-col rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 relative"
        onClick={handleCardClick}
      >
        <div className="absolute top-3 right-3 z-20 flex gap-2">
           <button 
             onClick={handleShare}
             title={shareCopied ? "Copied!" : "Share link"}
             className={`p-2.5 rounded-full transition-all flex items-center justify-center border shadow-sm backdrop-blur-md ${
               shareCopied 
                 ? 'bg-green-100 dark:bg-green-500/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/40' 
                 : 'bg-white/80 dark:bg-black/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/20 border-gray-300 dark:border-white/20'
             }`}
           >
             {shareCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
           </button>
           <SaveButton promptId={prompt.id!} className="" />
        </div>
        
        {prompt.mediaUrl && (
          <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-black" style={{ aspectRatio: '1.91 / 1' }}>
            {prompt.mediaUrl.match(/\.(mp4|webm)$/i) ? (
              <video src={prompt.mediaUrl} autoPlay muted loop className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <img
                src={prompt.mediaUrl}
                alt={prompt.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${prompt.id}/400/300`;
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 flex gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md font-sans">
                {prompt.category}
              </span>
              {prompt.isTrending && (
                <span className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-1 text-xs font-semibold text-white shadow-lg flex items-center gap-1 font-sans">
                  <Sparkles className="w-3 h-3" /> Trending
                </span>
              )}
            </div>
          </div>
        )}

        <div className={cn("flex flex-1 flex-col p-6", !prompt.mediaUrl && "pt-6")}>
          {!prompt.mediaUrl && (
            <div className="mb-4 flex gap-2">
               <span className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-white/10 rounded uppercase font-bold text-gray-700 dark:text-white tracking-widest border border-gray-200 dark:border-white/5 font-sans">
                 {prompt.category}
               </span>
               {prompt.isTrending && (
                <span className="text-[10px] px-2 py-1 bg-blue-50 dark:bg-blue-500/20 rounded uppercase font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40 flex items-center gap-1 font-sans">
                  Trending
                </span>
              )}
            </div>
          )}
          <h4 className="font-display font-bold text-lg mb-2 tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {prompt.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 flex-1 font-sans leading-relaxed">
            {prompt.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 font-mono">
              <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5"/> {prompt.viewCount}</span>
              <span className="flex items-center gap-1.5"><Copy className="w-3.5 h-3.5"/> {prompt.copyCount}</span>
            </div>

            <button
              onClick={handleCopy}
              className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded flex items-center transition-colors font-sans uppercase tracking-wider"
            >
              {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : null}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </motion.div>
  );
}
