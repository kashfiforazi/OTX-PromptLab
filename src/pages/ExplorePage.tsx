import React, { useEffect, useState } from 'react';
import { Prompt } from '../types';
import { fetchPrompts } from '../services/api';
import { PromptCard } from '../components/PromptCard';
import { Search, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAds } from '../contexts/AdsContext';
import { AdSense } from '../components/AdSense';
import { Adsterra } from '../components/Adsterra';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function ExplorePage() {
  const { settings: adsSettings } = useAds();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrompts() {
      try {
        const data = await fetchPrompts('approved');
        setPrompts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPrompts();
  }, []);

  const categories = Array.from(new Set(prompts.map(p => p.category)));

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/10 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="container max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">Explore Prompts</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-2xl text-lg">Browse our entire collection of high-quality, community-curated AI prompts.</p>
          
          <div className="w-full max-w-2xl relative group mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Search by keyword, tag, or description..."
              className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-full py-5 pl-16 pr-6 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all duration-300 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${!selectedCategory ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${selectedCategory === cat ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(n => (
              <div key={n} className="h-[300px] rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm animate-pulse transition-colors duration-300"></div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                {searchTerm || selectedCategory ? 'Search Results' : 'All Prompts'}
                <span className="ml-3 text-sm font-sans font-medium text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full">{filteredPrompts.length}</span>
              </h2>
            </div>

            {adsSettings?.enabled && (
              <div className="w-full flex flex-col gap-6 py-8 mb-8 border-b border-gray-100 dark:border-white/10">
                 {adsSettings.adsterraBannerTop && <Adsterra code={adsSettings.adsterraBannerTop} showPlaceholder={isAdmin} />}
                 {adsSettings.googleAdSlotSidebar && adsSettings.googleAdClient && <AdSense client={adsSettings.googleAdClient} slot={adsSettings.googleAdSlotSidebar} format="horizontal" />}
              </div>
            )}

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
                    <PromptCard prompt={prompt} onClick={() => navigate(`/prompt/${prompt.slug || prompt.id}`)} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredPrompts.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm transition-colors duration-300">
                  <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-white">No results found</h3>
                  <p>Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>
            
            {adsSettings?.enabled && (
              <div className="w-full flex flex-col items-center mt-16 overflow-hidden">
                {adsSettings.adsterraBannerBottom && <Adsterra code={adsSettings.adsterraBannerBottom} showPlaceholder={isAdmin} />}
                {adsSettings.googleAdSlotFooter && adsSettings.googleAdClient && <AdSense client={adsSettings.googleAdClient} slot={adsSettings.googleAdSlotFooter} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
