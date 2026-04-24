import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle, logout } from '../services/firebase';
import { fetchPrompts, updatePromptStatus, deletePrompt, submitPrompt, updatePrompt, getSocialLinks, updateSocialLinks, SocialLinks, AdsSettings, getAdsSettings, updateAdsSettings } from '../services/api';
import { Prompt } from '../types';
import { Shield, Loader2, Check, X, LayoutDashboard, LogOut, Star, TrendingUp, Plus, Edit2, Play, Copy, Settings, Lock, FileText, Megaphone } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'submissions' | 'add' | 'edit' | 'settings'>('dashboard');

  const [addForm, setAddForm] = useState({ title: '', description: '', promptText: '', mediaUrl: '', category: 'Image', tags: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [editPromptId, setEditPromptId] = useState<string | null>(null);

  const [socialForm, setSocialForm] = useState<SocialLinks>({ facebook: '', twitter: '', instagram: '', linkedin: '', discord: '', youtube: '', aboutText: '' });
  const [socialLoading, setSocialLoading] = useState(false);

  const [adsForm, setAdsForm] = useState<AdsSettings>({ googleAdClient: '', googleAdSlotHead: '', googleAdSlotSidebar: '', googleAdSlotFooter: '', enabled: false });
  const [adsLoading, setAdsLoading] = useState(false);

  // Password Logic
  const [passwordEntered, setPasswordEntered] = useState(() => localStorage.getItem('admin_pass') === 'OTX26');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'OTX26') {
      localStorage.setItem('admin_pass', 'OTX26');
      setPasswordEntered(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [approved, pending, socialData, adsData] = await Promise.all([
        fetchPrompts('approved', 1000),
        fetchPrompts('pending', 100),
        getSocialLinks(),
        getAdsSettings()
      ]);
      setPrompts([...approved, ...pending]);
      if(socialData) {
        setSocialForm({
          facebook: socialData.facebook || '',
          twitter: socialData.twitter || '',
          instagram: socialData.instagram || '',
          linkedin: socialData.linkedin || '',
          discord: socialData.discord || '',
          youtube: socialData.youtube || '',
          aboutText: socialData.aboutText || ''
        });
      }
      if(adsData) {
        setAdsForm({
          googleAdClient: adsData.googleAdClient || '',
          googleAdSlotHead: adsData.googleAdSlotHead || '',
          googleAdSlotSidebar: adsData.googleAdSlotSidebar || '',
          googleAdSlotFooter: adsData.googleAdSlotFooter || '',
          enabled: adsData.enabled || false
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadData();
    else setLoading(false);
  }, [isAdmin]);

  const handleApprove = async (id: string) => {
    if (!id) return;
    try {
      await updatePromptStatus(id, 'approved');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to reject this submission? It will be removed from the public view.")) return;
    try {
      await updatePromptStatus(id, 'rejected');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFlag = async (id: string, flag: 'isFeatured' | 'isTrending', currentValue: boolean) => {
    try {
      const pRef = doc(db, 'prompts', id);
      await updateDoc(pRef, { [flag]: !currentValue, updatedAt: serverTimestamp() });
      loadData();
    } catch(e) { console.error(e); }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await submitPrompt({
        ...addForm,
        tags: addForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        mediaUrl: addForm.mediaUrl || undefined,
        status: 'approved',
        isFeatured: false,
        isTrending: false
      });
      setAddForm({ title: '', description: '', promptText: '', mediaUrl: '', category: 'Image', tags: '' });
      setView('dashboard');
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPromptId) return;
    setAddLoading(true);
    try {
      await updatePrompt(editPromptId, {
        ...addForm,
        tags: addForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        mediaUrl: addForm.mediaUrl || undefined
      });
      setAddForm({ title: '', description: '', promptText: '', mediaUrl: '', category: 'Image', tags: '' });
      setEditPromptId(null);
      setView('dashboard');
      loadData();
    } catch(err) {
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  };

  const startEdit = (p: Prompt) => {
    setEditPromptId(p.id!);
    setAddForm({
      title: p.title,
      description: p.description,
      promptText: p.promptText,
      mediaUrl: p.mediaUrl || '',
      category: p.category,
      tags: p.tags.join(', ')
    });
    setView('edit');
  };

  const isMediaVideo = (url?: string) => url?.match(/\.(mp4|webm)$/i);

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSocialLoading(true);
    try {
      await updateSocialLinks(socialForm);
      alert('Settings updated successfully!');
    } catch(err) {
      console.error(err);
    } finally {
      setSocialLoading(false);
    }
  };

  const handleAdsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdsLoading(true);
    try {
      await updateAdsSettings(adsForm);
      alert('Google Ads settings updated successfully!');
    } catch(err) {
      console.error(err);
    } finally {
      setAdsLoading(false);
    }
  };

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked' || err.message?.includes('popup')) {
        setLoginError('Browser blocked the login popup. If you are in the AI Studio preview, please open the app in a new tab first (icon at top right).');
      } else {
        setLoginError(err.message || 'Failed to sign in. Please try again.');
      }
    }
  };

  if (!passwordEntered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-white dark:bg-[#0a0a0a] p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 w-full max-w-md transition-colors duration-300">
          <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-gray-900 dark:text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-3 text-gray-900 dark:text-white tracking-tight">Admin Portal</h1>
          <p className="mb-8 text-gray-500 dark:text-gray-400 font-medium">Please authenticate to continue securely.</p>
          
          <form onSubmit={handlePasswordSubmit} className="flex flex-col w-full gap-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">Security Key</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-center tracking-widest text-lg"
                autoFocus
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm font-medium animate-pulse">{passwordError}</p>
            )}
            <button type="submit" className="mt-2 bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm tracking-widest uppercase px-6 py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-md">
              Verify Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (authLoading) return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-white dark:bg-[#0a0a0a] p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 w-full max-w-md transition-colors duration-300">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-3 text-gray-900 dark:text-white tracking-tight">Identity Required</h1>
          <p className="mb-8 text-gray-500 dark:text-gray-400 font-medium">Link your Google account to verify admin privileges.</p>
          
          {loginError && (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 p-4 rounded-xl mb-6 text-sm text-center font-medium">
              {loginError}
            </div>
          )}

          <button onClick={handleLogin} className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 font-semibold px-6 py-4 rounded-xl flex items-center justify-center shadow-sm transition-all mb-4 text-sm mt-2">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3" /> 
            Sign in with Google
          </button>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center leading-relaxed">
            Note: If the popup doesn't open, please click the "Open in New Tab" icon at the top right of your screen.
          </p>
        </div>
      </div>
    );
  }

  const handleFullLogout = async () => {
    localStorage.removeItem('admin_pass');
    setPasswordEntered(false);
    await logout();
  };

  const handleFullLogoutError = async () => {
    localStorage.removeItem('admin_pass');
    setPasswordEntered(false);
    await logout();
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <X className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-red-600">Access Denied</h1>
        <button onClick={handleFullLogoutError} className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors">Sign out</button>
      </div>
    );
  }

  const approvedPrompts = prompts.filter(p => p.status === 'approved');
  const pendingPrompts = prompts.filter(p => p.status === 'pending');

  const topViewed = [...approvedPrompts].sort((a,b) => b.viewCount - a.viewCount).slice(0, 5);
  const topCopied = [...approvedPrompts].sort((a,b) => b.copyCount - a.copyCount).slice(0, 5);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10 flex-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Admin Control</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium transition-colors duration-300">Manage your entire AI prompt directory and configuration.</p>
        </div>
        <button onClick={handleFullLogout} className="flex items-center text-xs font-bold uppercase tracking-widest shrink-0 text-white dark:text-black bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-3 rounded-xl transition-colors shadow-sm">
          <LogOut className="w-4 h-4 mr-2" /> End Session
        </button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 transition-colors duration-300 hide-scrollbar">
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'submissions', label: `Queue ${pendingPrompts.length > 0 ? `(${pendingPrompts.length})` : ''}`, icon: FileText },
          { id: 'add', label: 'Create', icon: Plus },
          { id: 'settings', label: 'Config', icon: Settings },
          { id: 'ads', label: 'Monetize', icon: Megaphone }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => {setView(tab.id as any); setEditPromptId(null); if(tab.id === 'add') setAddForm({ title: '', description: '', promptText: '', mediaUrl: '', category: 'Image', tags: '' });}} 
            className={`px-5 py-3 font-semibold text-sm rounded-full whitespace-nowrap flex items-center gap-2 transition-all ${view === tab.id ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-transparent'}`}
          >
            <tab.icon className="w-4 h-4"/> {tab.label}
          </button>
        ))}
        {view === 'edit' && (
          <button className="px-5 py-3 font-semibold text-sm rounded-full whitespace-nowrap flex items-center gap-2 transition-all bg-blue-600 text-white shadow-sm shadow-blue-500/30">
            <Edit2 className="w-4 h-4"/> Edit Prompt
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>
      ) : view === 'settings' ? (
        <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-8 rounded-2xl max-w-3xl shadow-sm relative overflow-hidden transition-colors duration-300">
          <h2 className="text-2xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white">Site Settings</h2>
          <form onSubmit={handleSocialSubmit} className="space-y-4 relative z-10">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-white/10 pb-2">About Page Text</h3>
            <textarea placeholder="Write a short description about this platform..." rows={4} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={socialForm.aboutText || ''} onChange={e => setSocialForm({...socialForm, aboutText: e.target.value})} />
            
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mt-6 mb-2 border-b border-gray-200 dark:border-white/10 pb-2">Social Media Links</h3>
            
            {['facebook', 'twitter', 'instagram', 'linkedin', 'discord', 'youtube'].map((platform) => (
              <div key={platform} className="flex flex-col gap-1">
                 <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 capitalize">{platform} URL</label>
                 <input placeholder={`https://${platform}.com/...`} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={socialForm[platform as keyof SocialLinks] || ''} onChange={e => setSocialForm({...socialForm, [platform]: e.target.value})} />
              </div>
            ))}
            
            <button type="submit" disabled={socialLoading} className="bg-gray-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-xl font-black text-sm tracking-widest uppercase hover:bg-gray-800 dark:hover:bg-gray-200 transition-all w-full mt-6 shadow-sm">
              {socialLoading ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      ) : view === 'ads' ? (
        <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-8 rounded-2xl max-w-3xl shadow-sm relative overflow-hidden transition-colors duration-300">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
             <div>
               <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Google Ads Setup</h2>
               <p className="text-sm text-gray-500 mt-1">Configure your AdSense client ID and ad slots here.</p>
             </div>
             <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={adsForm.enabled || false} onChange={e => setAdsForm({...adsForm, enabled: e.target.checked})} />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${adsForm.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${adsForm.enabled ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {adsForm.enabled ? 'Enabled' : 'Disabled'}
                </div>
             </label>
          </div>
          <form onSubmit={handleAdsSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-1">Google Ad Client ID (data-ad-client)</label>
              <input placeholder="ca-pub-XXXXXXXXXXXXX" className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={adsForm.googleAdClient || ''} onChange={e => setAdsForm({...adsForm, googleAdClient: e.target.value})} />
              <p className="text-xs text-gray-500 mt-1">Found in your AdSense code snippet.</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-4">Ad Slots (data-ad-slot)</h3>
              <div className="space-y-4">
                <div>
                   <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Top Banner Ad Slot</label>
                   <input placeholder="1234567890" className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={adsForm.googleAdSlotHead || ''} onChange={e => setAdsForm({...adsForm, googleAdSlotHead: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Sidebar Ad Slot</label>
                   <input placeholder="0987654321" className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={adsForm.googleAdSlotSidebar || ''} onChange={e => setAdsForm({...adsForm, googleAdSlotSidebar: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Footer/In-feed Ad Slot</label>
                   <input placeholder="1122334455" className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={adsForm.googleAdSlotFooter || ''} onChange={e => setAdsForm({...adsForm, googleAdSlotFooter: e.target.value})} />
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={adsLoading} className="bg-gray-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-xl font-black text-sm tracking-widest uppercase hover:bg-gray-800 dark:hover:bg-gray-200 transition-all w-full mt-6 shadow-sm">
              {adsLoading ? "Saving..." : "Save Ads Setup"}
            </button>
          </form>
        </div>
      ) : view === 'add' || view === 'edit' ? (
        <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-8 rounded-2xl max-w-3xl shadow-sm relative overflow-hidden transition-colors duration-300">
          <h2 className="text-2xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white">{view === 'edit' ? 'Edit Prompt' : 'Create New Prompt'}</h2>
          <form onSubmit={view === 'edit' ? handleEditSubmit : handleAddSubmit} className="space-y-4 relative z-10">
            <input required placeholder="Title" className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={addForm.title} onChange={e => setAddForm({...addForm, title: e.target.value})} />
            <textarea required placeholder="Description" rows={3} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})} />
            <textarea required placeholder="Prompt text" rows={6} className="w-full bg-gray-50 dark:bg-black/50 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600" value={addForm.promptText} onChange={e => setAddForm({...addForm, promptText: e.target.value})} />
            <div className="flex flex-col md:flex-row gap-4">
              <select className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl min-w-[150px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white appearance-none cursor-pointer" value={addForm.category} onChange={e => setAddForm({...addForm, category: e.target.value})}>
                {['Image','Video','Logo','Gaming','Banner','Thumbnail'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input placeholder="Image or Video URL (Optional)" className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={addForm.mediaUrl} onChange={e => setAddForm({...addForm, mediaUrl: e.target.value})} />
            </div>
            <input placeholder="Tags (comma separated)" className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={addForm.tags} onChange={e => setAddForm({...addForm, tags: e.target.value})} />
            <button type="submit" disabled={addLoading} className="bg-blue-600 dark:bg-blue-500 text-white py-4 px-6 rounded-xl font-black text-sm tracking-widest uppercase hover:bg-blue-700 dark:hover:bg-blue-600 transition-all w-full mt-4 shadow-sm">
              {addLoading ? "Saving..." : (view === 'edit' ? "Save Changes" : "Create Prompt")}
            </button>
          </form>
        </div>
      ) : view === 'submissions' ? (
          <div className="space-y-6">
            {pendingPrompts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm transition-colors duration-300">
                <Check className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No pending submissions to review.</p>
              </div>
            ) : pendingPrompts.map(prompt => (
              <div key={prompt.id} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors duration-300">
                {prompt.mediaUrl && (
                  <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-black border border-gray-100 dark:border-white/5">
                    {isMediaVideo(prompt.mediaUrl) ? (
                      <video src={prompt.mediaUrl} autoPlay muted loop className="w-full h-full object-cover" />
                    ) : (
                      <img src={prompt.mediaUrl} className="w-full h-full object-cover" alt="Preview" />
                    )}
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">{prompt.category}</span>
                     <h3 className="font-extrabold text-xl mt-1 tracking-tight text-gray-900 dark:text-white">{prompt.title}</h3>
                   </div>
                   <span className="text-xs text-gray-400 dark:text-gray-500 font-mono font-medium">{new Date(prompt.createdAt).toLocaleDateString()}</span>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 font-medium">{prompt.description}</p>
                 <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-mono text-gray-700 dark:text-gray-300 mb-6 max-h-32 overflow-y-auto w-full transition-colors duration-300">
                   {prompt.promptText}
                 </div>
                 <div className="flex gap-3">
                   <button onClick={() => handleApprove(prompt.id!)} className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 px-6 py-2 rounded-lg font-bold text-sm tracking-wider uppercase hover:bg-blue-600 hover:text-white transition-colors">Approve</button>
                   <button onClick={() => handleReject(prompt.id!)} className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-6 py-2 rounded-lg font-bold text-sm tracking-wider uppercase hover:bg-red-600 hover:text-white transition-colors">Reject</button>
                 </div>
                </div>
              </div>
            ))}
          </div>
      ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-sm transition-colors duration-300">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Play className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Top Viewed</h3>
                <div className="space-y-4">
                  {topViewed.map(p => (
                    <div key={'view-'+p.id} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-900 dark:text-gray-200 truncate max-w-[250px]">{p.title}</span>
                      <span className="text-gray-500 dark:text-gray-400 font-mono">{p.viewCount}</span>
                    </div>
                  ))}
                  {topViewed.length === 0 && <span className="text-sm text-gray-400">No data</span>}
                </div>
              </div>
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-sm transition-colors duration-300">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Top Copied</h3>
                <div className="space-y-4">
                  {topCopied.map(p => (
                    <div key={'copy-'+p.id} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-900 dark:text-gray-200 truncate max-w-[250px]">{p.title}</span>
                      <span className="text-gray-500 dark:text-gray-400 font-mono">{p.copyCount}</span>
                    </div>
                  ))}
                  {topCopied.length === 0 && <span className="text-sm text-gray-400">No data</span>}
                </div>
              </div>
            </div>

              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-4 sm:p-8 rounded-3xl overflow-x-auto shadow-sm transition-colors duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-display font-bold tracking-tight text-gray-900 dark:text-white">Active Directory</h2>
                <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold">{approvedPrompts.length} Items</span>
              </div>
              <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10">
                      <th className="pb-4 px-4 font-bold">Details</th>
                      <th className="pb-4 px-4 font-bold">Metrics</th>
                      <th className="pb-4 px-4 text-center font-bold">Tags</th>
                      <th className="pb-4 px-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedPrompts.map(prompt => (
                      <tr key={prompt.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-5 px-4 max-w-[250px] sm:max-w-[350px] truncate">
                          <div className="font-display font-bold text-[15px] text-gray-900 dark:text-white mb-1 tracking-tight">{prompt.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{prompt.description}</div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="text-xs font-mono text-gray-600 dark:text-gray-300 font-semibold flex items-center gap-1.5"><Copy className="w-3.5 h-3.5"/> {prompt.copyCount}</div>
                          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1.5"><Play className="w-3.5 h-3.5"/> {prompt.viewCount}</div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => toggleFlag(prompt.id!, 'isFeatured', prompt.isFeatured)} className={`p-2 rounded border transition-all ${prompt.isFeatured ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-transparent shadow-md' : 'bg-transparent text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'}`} title="Toggle Featured"><Star className={`w-4 h-4 ${prompt.isFeatured ? 'fill-white' : ''}`}/></button>
                            <button onClick={() => toggleFlag(prompt.id!, 'isTrending', prompt.isTrending)} className={`p-2 rounded border transition-all ${prompt.isTrending ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-transparent shadow-md' : 'bg-transparent text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'}`} title="Toggle Trending"><TrendingUp className="w-4 h-4"/></button>
                          </div>
                        </td>
                        <td className="py-5 px-4 text-right space-x-2">
                           <button onClick={() => startEdit(prompt)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-white hover:bg-gray-900 dark:hover:bg-white dark:hover:text-black rounded-lg border border-transparent hover:border-gray-900 dark:hover:border-white transition-all shadow-sm" title="Edit Prompt"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => handleReject(prompt.id!)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-white hover:bg-red-600 rounded-lg border border-transparent hover:border-red-600 transition-all shadow-sm" title="Reject Prompt"><X className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>
      )}
    </div>
  );
}
