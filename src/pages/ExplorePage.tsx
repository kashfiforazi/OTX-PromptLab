import React, { useEffect, useState } from 'react';
import { Prompt } from '../types';
import { fetchPrompts } from '../services/api';
import { PromptCard } from '../components/PromptCard';
import { Search, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAds } from '../contexts/AdsContext';
import { AdSense } from '../components/AdSense';
import { Adsterra } from '../components/Adsterra';
import { useNavigate } from 'react-router-dom';

export function ExplorePage() {
  const { settings: adsSettings } = useAds();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

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
  const aiModels = Array.from(new Set(prompts.map(p => p.aiModel).filter(Boolean)));

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.aiModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesModel = selectedModel ? p.aiModel === selectedModel : true;
    return matchesSearch && matchesCategory && matchesModel;
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

          <div className="flex flex-col gap-6 w-full">
            {aiModels.length > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] mb-3">Filter by AI Model</span>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setSelectedModel(null)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 border uppercase tracking-wider ${!selectedModel ? 'bg-blue-600 border-transparent text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/10'}`}
                  >
                    All AI
                  </button>
                  {aiModels.map(model => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model as string)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 border uppercase tracking-wider ${selectedModel === model ? 'bg-blue-600 border-transparent text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/10'}`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {categories.length > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] mb-3">Categories</span>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 border uppercase tracking-wider ${!selectedCategory ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/10'}`}
                  >
                    All Types
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 border uppercase tracking-wider ${selectedCategory === cat ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/10'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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

            {adsSettings?.enabled && adsSettings?.adsterraScriptBanner && (
              <div className="w-full h-auto py-8 mb-8 border-b border-gray-100 dark:border-white/10">
                 <Adsterra scriptHtml={adsSettings.adsterraScriptBanner} />
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
            
            {adsSettings?.enabled && adsSettings?.adsterraScriptFooter && (
              <div className="w-full flex justify-center mt-16 overflow-hidden">
                 <Adsterra scriptHtml={adsSettings.adsterraScriptFooter} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
