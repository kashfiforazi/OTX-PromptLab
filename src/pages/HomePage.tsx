import { useEffect, useState } from 'react';
import { Prompt } from '../types';
import { fetchPrompts } from '../services/api';
import { PromptCard } from '../components/PromptCard';
import { Sparkles, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

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

  const featured = prompts.filter(p => p.isFeatured);
  const trending = prompts.filter(p => p.isTrending);
  
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 flex justify-center text-center bg-white dark:bg-transparent border-b border-gray-200 dark:border-white/10 mb-12 transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505] -z-10 hidden dark:block" />
        <div className="container max-w-4xl px-4 relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-400 mb-8 backdrop-blur-sm transition-colors duration-300"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Welcome to the future of AI</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white transition-colors duration-300"
          >
            Discover & Share
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
              Premium Prompts
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto transition-colors duration-300"
          >
            Elevate your AI generation with our community-curated collection of high-quality prompts for midjourney, chatgpt, and more.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xl relative group mx-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Search by keyword, tag, or description..."
              className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded-full py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-300"
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
            {featured.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Featured Prompts</h2>
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Trending Right Now</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trending.map(prompt => (
                     <PromptCard key={prompt.id} prompt={prompt} onClick={() => setSelectedPrompt(prompt)} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Newest Uploads</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {prompts.slice(0, 12).map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} onClick={() => setSelectedPrompt(prompt)} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Search Results</h2>
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
          </div>
        )}
      </div>

      {/* Modal for viewing prompt details */}
      <AnimatePresence>
        {selectedPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/80 backdrop-blur-sm"
               onClick={() => setSelectedPrompt(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-black/80 shadow-2xl w-full max-w-3xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-100 dark:border-white/10 transition-colors duration-300"
            >
               {selectedPrompt.mediaUrl && (
                 <div className="h-64 w-full bg-gray-100 dark:bg-black relative">
                   {selectedPrompt.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                     <video src={selectedPrompt.mediaUrl} autoPlay muted loop className="w-full h-full object-cover" />
                   ) : (
                     <img src={selectedPrompt.mediaUrl} className="w-full h-full object-cover" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent opacity-100" />
                 </div>
               )}
               <div className="p-8 flex-1 overflow-y-auto">
                 <div className="flex justify-between items-start mb-4">
                   <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{selectedPrompt.title}</h2>
                   <button onClick={() => setSelectedPrompt(null)} className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 p-2 rounded-full transition-colors">
                     ✕
                   </button>
                 </div>
                 <div className="flex gap-2 mb-6">
                   <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border dark:border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{selectedPrompt.category}</span>
                   {selectedPrompt.tags.map(tag => (
                     <span key={tag} className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>
                   ))}
                 </div>
                 <p className="text-gray-600 dark:text-gray-400 mb-8 text-base leading-relaxed font-medium">{selectedPrompt.description}</p>
                 
                 <div className="mb-6">
                   <h3 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 font-bold">Prompt Text</h3>
                   <div className="bg-gray-50 dark:bg-black/60 p-6 rounded-2xl border border-gray-200 dark:border-white/10 relative group transition-colors duration-300">
                     <p className="font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedPrompt.promptText}</p>
                   </div>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
