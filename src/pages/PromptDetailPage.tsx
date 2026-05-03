import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Prompt } from '../types';
import { fetchPrompts, fetchPromptBySlug } from '../services/api';
import { Loader2, ArrowLeft, Copy, Check, Play, Share2, ShieldCheck, User } from 'lucide-react';
import { useAds } from '../contexts/AdsContext';
import { AdSense } from '../components/AdSense';
import { Adsterra } from '../components/Adsterra';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { copyToClipboard } from '../utils/copy';

import { SaveButton } from '../components/SaveButton';

export function PromptDetailPage() {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();
  const { settings: adsSettings } = useAds();
  const { isAdmin } = useAuth();
  
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrompt() {
      if (!idOrSlug) return;
      try {
        setLoading(true);
        
        let targetData: Prompt | null = null;
        
        // 1. Try to fetch as ID directly
        try {
          const docRef = doc(db, 'prompts', idOrSlug);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().status === 'approved') {
            targetData = { id: docSnap.id, ...docSnap.data() } as Prompt;
          }
        } catch (e) {
          // ID check failed or not a valid ID
        }
        
        // 2. If not found by ID, try by Slug
        if (!targetData) {
          targetData = await fetchPromptBySlug(idOrSlug);
        }
        
        if (targetData && targetData.status === 'approved') {
          setPrompt(targetData);
          
          // Update page title for SEO
          document.title = `${targetData.title} - Oentrix PromptLab`;
          
          // Increment view count
          try {
            const promptRef = doc(db, 'prompts', targetData.id!);
            updateDoc(promptRef, { 
              viewCount: increment(1),
              updatedAt: serverTimestamp()
            }).catch(e => console.error("Non-blocking view count update failed", e));
          } catch (e) {
            console.error("Failed to update view count", e);
          }
        } else {
          setError("Prompt not found or is pending approval.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load prompt.");
      } finally {
        setLoading(false);
      }
    }
    loadPrompt();
    
    return () => {
      document.title = "Oentrix PromptLab - Discover & Share Premium AI Prompts";
    };
  }, [idOrSlug]);

  const handleCopy = async (text: string) => {
    if (!prompt) return;
    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      const docRef = doc(db, 'prompts', prompt.id!);
      await updateDoc(docRef, { copyCount: increment(1) });
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    try {
      const sharePath = prompt?.slug ? `/prompt/${prompt.slug}` : `/prompt/${prompt?.id}`;
      await copyToClipboard(`${window.location.origin}${sharePath}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black px-4">
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-10 rounded-3xl text-center max-w-md w-full shadow-sm">
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{error || "This prompt doesn't exist."}</p>
          <button onClick={() => navigate('/explore')} className="bg-gray-900 dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full">
            Browse All Prompts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-black transition-colors duration-300">
        <div className="container max-w-4xl mx-auto px-4 pt-12 md:pt-20">
          <div className="w-full mb-8">
            {adsSettings?.enabled && adsSettings?.adsterraScriptPromptTop && (
              <Adsterra scriptHtml={adsSettings.adsterraScriptPromptTop} />
            )}
          </div>
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>

        <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col transition-colors duration-300">
          {prompt.mediaUrl && (
            <div className="relative w-full bg-gray-100 dark:bg-[#050505]" style={{ aspectRatio: '1.91 / 1' }}>
              {prompt.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                <video src={prompt.mediaUrl} autoPlay muted loop className="w-full h-full object-cover" />
              ) : (
                <img src={prompt.mediaUrl} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-transparent opacity-100" />
            </div>
          )}
          
          <div className={`p-8 md:p-12 ${prompt.mediaUrl ? '-mt-10 md:-mt-16 relative z-10' : ''}`}>
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{prompt.category}</span>
                {prompt.aiModel && (
                  <span className="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{prompt.aiModel}</span>
                )}
                {prompt.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>
                ))}
              </div>
              <SaveButton promptId={prompt.id!} className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-xs" />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white tracking-tight mb-6">{prompt.title}</h1>
            
            <div className="flex items-center gap-3 mb-6 bg-gray-50 dark:bg-white/5 w-fit px-4 py-2 rounded-full border border-gray-200 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden shadow-inner">
                {prompt.authorName === 'Oentrix Team' ? <ShieldCheck className="w-4 h-4"/> : <User className="w-4 h-4"/>}
              </div>
              <span className="font-bold text-sm flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                {prompt.authorName || 'Anonymous'}
                {prompt.authorName === 'Oentrix Team' && <ShieldCheck className="w-4 h-4 text-blue-500" title="Verified Admin"/>}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 font-sans">{prompt.description}</p>
            
            {/* Ad Slot #1 - Middle */}
            {adsSettings?.enabled && adsSettings?.adsterraScriptPromptTop && (
              <div className="w-full h-auto py-8 mb-8 border-y border-gray-100 dark:border-white/10">
                <Adsterra scriptHtml={adsSettings.adsterraScriptPromptTop} label="Content Top Ad" />
              </div>
            )}

            <div className="flex items-center gap-6 mb-12 text-sm text-gray-500 dark:text-gray-400 font-mono pb-8 border-b border-gray-100 dark:border-white/10">
              <span className="flex items-center gap-2"><Play className="w-4 h-4"/> {prompt.viewCount} Views</span>
              <span className="flex items-center gap-2"><Copy className="w-4 h-4"/> {prompt.copyCount} Copies</span>
            </div>

            <div className="mb-6 flex gap-2">
              <button 
                onClick={handleShare}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-colors uppercase tracking-wider ${shareCopied ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10' : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20'}`}
              >
                {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {shareCopied ? 'Link Copied' : 'Share Post'}
              </button>
            </div>

            <div className="space-y-8">
              {[ { promptText: prompt.promptText, mediaUrl: null }, ...(prompt.items || []) ].filter(i => i.promptText.trim()).map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md">
                      {idx === 0 ? 'Main Prompt' : `Variation #${idx}`}
                    </h3>
                    <button 
                      onClick={() => handleCopy(item.promptText)}
                      className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl transition-colors uppercase tracking-wider shadow-sm"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  {item.mediaUrl && (
                    <div className="w-full max-w-sm bg-gray-100 dark:bg-[#050505] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm aspect-[3/4]">
                      {item.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                        <video src={item.mediaUrl} autoPlay muted loop className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.mediaUrl} className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  <div className="bg-gray-50 dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 group">
                    <p className="font-mono text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{item.promptText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ad Slot #2 - Bottom */}
        {adsSettings?.enabled && adsSettings?.adsterraScriptPromptBottom && (
          <div className="w-full flex flex-col items-center mt-16 overflow-hidden">
             <Adsterra scriptHtml={adsSettings.adsterraScriptPromptBottom} label="Content Bottom Ad" />
          </div>
        )}
      </div>
    </div>
  );
}
