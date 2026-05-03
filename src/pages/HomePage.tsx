import React, { useEffect, useState } from 'react';
import { Prompt } from '../types';
import { fetchPrompts, getBanners, Banner } from '../services/api';
import { PromptCard } from '../components/PromptCard';
import { Sparkles, Search, Loader2, ExternalLink, Image as ImageIcon, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAds } from '../contexts/AdsContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { AdSense } from '../components/AdSense';
import { Adsterra } from '../components/Adsterra';
import { SaveButton } from '../components/SaveButton';

export function HomePage() {
  const navigate = useNavigate();
  const { settings: adsSettings } = useAds();
  const { isAdmin } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

          {/* Dynamic Banners Slider */}
          {banners.length > 0 && !searchTerm && !selectedCategory && (
            <div className="w-full max-w-6xl mx-auto mb-10 overflow-hidden rounded-3xl shadow-lg relative group">
              <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect="fade"
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                loop={true}
                className="w-full h-56 md:h-80 lg:h-[400px] rounded-3xl"
              >
                {banners.map((banner, index) => (
                  <SwiperSlide key={index} className="w-full h-full">
                    <a 
                      href={banner.link || '#'} 
                      target={banner.link?.startsWith('http') ? '_blank' : '_self'} 
                      rel="noopener noreferrer"
                      className="relative block w-full h-full"
                    >
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      {banner.title && (
                        <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-10">
                          <h3 className="text-white font-display font-bold text-2xl md:text-5xl leading-tight drop-shadow-lg max-w-3xl">{banner.title}</h3>
                        </div>
                      )}
                    </a>
                  </SwiperSlide>
                ))}

                <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </Swiper>
              <style dangerouslySetInnerHTML={{__html:`
                .swiper-pagination-bullet { background: white; opacity: 0.5; }
                .swiper-pagination-bullet-active { background: white; opacity: 1; }
              `}} />
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
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
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
          <div className="pt-10">
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
          <div className="flex flex-col">
            {adsSettings?.enabled && adsSettings?.adsterraScriptBanner && (
              <div className="w-full flex justify-center mb-10 overflow-hidden">
                 <Adsterra scriptHtml={adsSettings.adsterraScriptBanner} />
              </div>
            )}

            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Newest Uploads</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {prompts.slice(0, 12).map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} onClick={() => navigate(`/prompt/${prompt.slug || prompt.id}`)} />
                ))}
              </div>
            </section>
            
            {adsSettings?.enabled && (adsSettings?.googleAdSlotSidebar || adsSettings?.googleAdClient) && (
              <div className="w-full flex justify-center overflow-hidden mb-16">
                 <AdSense client={adsSettings.googleAdClient || ''} slot={adsSettings.googleAdSlotSidebar || ''} format="horizontal" showPlaceholder={isAdmin} />
              </div>
            )}
            
            {featured.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Featured Prompts</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featured.map(prompt => (
                     <PromptCard key={prompt.id} prompt={prompt} onClick={() => navigate(`/prompt/${prompt.slug || prompt.id}`)} />
                  ))}
                </div>
              </section>
            )}

            {trending.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Trending Right Now</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trending.map(prompt => (
                     <PromptCard key={prompt.id} prompt={prompt} onClick={() => navigate(`/prompt/${prompt.slug || prompt.id}`)} />
                  ))}
                </div>
              </section>
            )}

            {adsSettings?.enabled && adsSettings?.adsterraScriptFooter && (
              <div className="w-full h-auto py-12 border-t border-gray-100 dark:border-white/10 mt-4 text-center">
                <Adsterra scriptHtml={adsSettings.adsterraScriptFooter} />
              </div>
            )}
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
                    <PromptCard prompt={prompt} onClick={() => navigate(`/prompt/${prompt.slug || prompt.id}`)} />
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
