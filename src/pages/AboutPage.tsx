import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSocialLinks, SocialLinks } from '../services/api';
import { Facebook, Twitter, Instagram, Linkedin, MessageSquare, Youtube, LayoutDashboard, Loader2, Link as LinkIcon } from 'lucide-react';
import { Logo } from '../components/Logo';

export function AboutPage() {
  const [links, setLinks] = useState<SocialLinks>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSocialLinks().then(data => {
      setLinks(data);
      setLoading(false);
    });
  }, []);

  const socialItems = [
    { key: 'facebook', icon: Facebook, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
    { key: 'twitter', icon: Twitter, label: 'Twitter / X', color: 'bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200' },
    { key: 'instagram', icon: Instagram, label: 'Instagram', color: 'bg-pink-600 hover:bg-pink-700' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
    { key: 'discord', icon: MessageSquare, label: 'Discord', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { key: 'youtube', icon: Youtube, label: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 relative z-10 flex-1">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-sm transition-colors duration-300 text-center">
        
        <div className="flex justify-center mb-6">
          <Logo className="scale-125" showWordmark={true} />
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6 mt-8">About Us</h1>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>
        ) : (
          <div className="space-y-12">
            <div className="prose dark:prose-invert max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <p>
                {links.aboutText || "Welcome to Oentrix Prompt Lab. We are dedicated to providing a collaborative platform for creators to discover, share, and manage high-quality AI prompts. Join our growing community and elevate your creative journey."}
              </p>
            </div>

            <div className="pt-8 border-t border-gray-200 dark:border-white/10">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Connect With Us</h2>
              
              <div className="flex flex-wrap justify-center gap-4">
                {socialItems.map(item => {
                  const url = links[item.key as keyof SocialLinks];
                  if (!url) return null;
                  
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium text-sm transition-transform hover:scale-105 ${item.color} shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </a>
                  );
                })}

                {!Object.keys(links).some(k => k !== 'aboutText' && links[k as keyof SocialLinks]) && (
                  <p className="text-sm text-gray-500 italic">Social links will be added soon.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
