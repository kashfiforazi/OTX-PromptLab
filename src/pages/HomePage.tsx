import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Prompt } from '../types';
import { fetchPrompts, getBanners, Banner } from '../services/api';
import { PromptCard } from '../components/PromptCard';
import { Sparkles, Search, Loader2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAds } from '../contexts/AdsContext';
import { AdSense } from '../components/AdSense';
import { SaveButton } from '../components/SaveButton';

export function HomePage() {
  const { settings: adsSettings } = useAds();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [promptsData, bannersData] = await Promise.all([
          fetchPrompts('approved'),
          getBanners()
        ]);
        setPrompts(promptsData);
        setBanners(bannersData.filter(b => b.imageUrl)); // Only keep valid banners
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = Array.from(new Set(prompts.map(p => p.category)));

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const featured = prompts.filter(p => p.isFeatured);
  const trending = prompts.filter(p => p.isTrending);
  
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-2 pb-12 md:pt-4 md:pb-16 flex justify-center text-center bg-gray-50 dark:bg-[#000000] border-b border-gray-200 dark:border-white/10 mb-8 transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 dark:to-black" />
        
        <div className="container max-w-7xl px-4 relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center rounded-full border border-blue-200/50 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-5 backdrop-blur-sm transition-colors duration-300 tracking-wide uppercase"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            <span>Welcome to the future of AI</span>
          </motion.div>

          {/* Dynamic Banners */}
          {banners.length > 0 && !searchTerm && !selectedCategory && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
              {banners.map((banner, index) => (
                <a 
                  key={index} 
                  href={banner.link || '#'} 
                  target={banner.link?.startsWith('http') ? '_blank' : '_self'} 
                  rel="noopener noreferrer"
                  className="group relative h-40 md:h-48 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  {banner.title && (
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-white font-display font-bold text-xl leading-tight drop-shadow-md text-left">{banner.title}</h3>
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-8 text-gray-900 dark:text-white transition-colors duration-300"
          >
            Discover & Share
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 filter drop-shadow-sm">
              Premium Prompts
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto transition-colors duration-300 font-medium leading-relaxed"
          >
            Elevate your AI generation with our community-curated collection of high-quality prompts for midjourney, chatgpt, and more.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-2xl relative group mx-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Search by keyword, tag, or description..."
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-5 pl-16 pr-6 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${!selectedCategory ? 'bg-gray-900 dark:bg-blue-600 text-white dark:text-white dark:shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${selectedCategory === cat ? 'bg-gray-900 dark:bg-blue-600 text-white dark:text-white dark:shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse"></div>
                <div className="w-48 h-8 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4].map(n => (
                  <div key={n} className="h-64 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm animate-pulse transition-colors duration-300"></div>
                ))}
              </div>
            </section>
          </div>
        ) : (!searchTerm && !selectedCategory) ? (
          <div className="space-y-16">
            {adsSettings?.enabled &&(adsSettings?.googleAdSlotHead || adsSettings?.googleAdClient) && (
              <div className="w-full flex justify-center mb-8 overflow-hidden">
                 <AdSense client={adsSettings.googleAdClient || ''} slot={adsSettings.googleAdSlotHead || ''} />
              </div>
            )}
            
            {featured.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Featured Prompts</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featured.map(prompt => (
                     <PromptCard key={prompt.id} prompt={prompt} onClick={() => setSelectedPrompt(prompt)} />
                  ))}
                </div>
              </section>
            )}
            
            {trending.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Trending Right Now</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trending.map(prompt => (
                     <PromptCard key={prompt.id} prompt={prompt} onClick={() => setSelectedPrompt(prompt)} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Newest Uploads</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {prompts.slice(0, 12).map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} onClick={() => setSelectedPrompt(prompt)} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredPrompts.map((prompt) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                  >
                    <PromptCard prompt={prompt} onClick={() => setSelectedPrompt(prompt)} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredPrompts.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No results found</h3>
                  <p>Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>
            
            {adsSettings?.enabled &&(adsSettings?.googleAdSlotFooter || adsSettings?.googleAdClient) && (
              <div className="w-full flex justify-center mt-16 overflow-hidden">
                 <AdSense client={adsSettings.googleAdClient || ''} slot={adsSettings.googleAdSlotFooter || ''} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for viewing prompt details */}
      {createPortal(
        <AnimatePresence>
          {selectedPrompt && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/90 backdrop-blur-md"
                 onClick={() => setSelectedPrompt(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={e => e.stopPropagation()}
                className="bg-white dark:bg-[#0a0a0a] shadow-2xl w-full max-w-3xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-100 dark:border-white/10 transition-colors duration-300 relative"
              >
                 {selectedPrompt.mediaUrl && (
                   <div className="relative w-full bg-gray-100 dark:bg-black shrink-0" style={{ aspectRatio: '1.91 / 1' }}>
                     {selectedPrompt.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                       <video src={selectedPrompt.mediaUrl} autoPlay muted loop className="w-full h-full object-cover" />
                     ) : (
                       <img src={selectedPrompt.mediaUrl} className="w-full h-full object-cover" />
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-white/20 dark:via-[#0a0a0a]/20 to-transparent opacity-100" />
                   </div>
                 )}
                 <div className="p-8 md:p-10 flex-1 overflow-y-auto z-10 -mt-10 md:-mt-16">
                   <div className="flex justify-between items-start mb-4 gap-4 relative">
                     <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight break-words">{selectedPrompt.title}</h2>
                     <div className="flex gap-2">
                       <SaveButton promptId={selectedPrompt.id!} className="shrink-0 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 p-2.5 rounded-full" />
                       <button 
                         onClick={() => window.open(`/prompt/${selectedPrompt.id}`, '_blank')}
                         className="shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 p-2.5 rounded-full transition-colors"
                         title="Open Full Page"
                       >
                         <ExternalLink className="h-5 w-5" />
                       </button>
                       <button onClick={() => setSelectedPrompt(null)} className="shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 p-2.5 rounded-full transition-colors">
                         ✕
                       </button>
                     </div>
                   </div>
                   <div className="flex flex-wrap gap-2 mb-8">
                     <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{selectedPrompt.category}</span>
                     {selectedPrompt.tags.map(tag => (
                       <span key={tag} className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-white/10 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>
                     ))}
                   </div>
                   <p className="text-gray-600 dark:text-gray-300 mb-10 text-base md:text-lg leading-relaxed font-sans">{selectedPrompt.description}</p>
                   
                   <div className="mb-2">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">Prompt String</h3>
                       <button 
                         onClick={async () => {
                           try {
                             await navigator.clipboard.writeText(selectedPrompt.promptText);
                             // Need to show copied feedback, but we can just use a simple alert since there's no state right here
                             alert('Copied to clipboard!');
                           } catch (err) {}
                         }}
                         className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider"
                       >
                         Copy Text
                       </button>
                     </div>
                     <div className="bg-gray-50 dark:bg-[#111] p-6 lg:p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 relative group transition-colors duration-300">
                       <p className="font-mono text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{selectedPrompt.promptText}</p>
                     </div>
                   </div>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
