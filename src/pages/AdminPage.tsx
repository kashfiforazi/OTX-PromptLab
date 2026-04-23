import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle, logout } from '../services/firebase';
import { fetchPrompts, updatePromptStatus, deletePrompt, submitPrompt, updatePrompt, getSocialLinks, updateSocialLinks, SocialLinks } from '../services/api';
import { Prompt } from '../types';
import { Shield, Loader2, Check, X, LayoutDashboard, LogOut, Star, TrendingUp, Plus, Edit2, Play, Copy, Settings } from 'lucide-react';
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [approved, pending, socialData] = await Promise.all([
        fetchPrompts('approved', 1000),
        fetchPrompts('pending', 100),
        getSocialLinks()
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
    if (!confirm("Are you sure you want to reject and delete this submission?")) return;
    try {
      await deletePrompt(id);
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

  if (authLoading) return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <Shield className="w-16 h-16 text-blue-600 mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Admin Access Required</h1>
        <button onClick={signInWithGoogle} className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-semibold px-6 py-3 rounded-lg flex items-center shadow-sm transition-all">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3" /> Sign in with Google
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <X className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-red-600">Access Denied</h1>
        <button onClick={logout} className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors">Sign out</button>
      </div>
    );
  }

  const approvedPrompts = prompts.filter(p => p.status === 'approved');
  const pendingPrompts = prompts.filter(p => p.status === 'pending');

  const topViewed = [...approvedPrompts].sort((a,b) => b.viewCount - a.viewCount).slice(0, 5);
  const topCopied = [...approvedPrompts].sort((a,b) => b.copyCount - a.copyCount).slice(0, 5);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 relative z-10 flex-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-white transition-colors duration-300">Admin Portal</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium transition-colors duration-300">Manage public prompts and moderate community submissions.</p>
        </div>
        <button onClick={logout} className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-white/5 px-4 py-2 rounded border border-gray-200 dark:border-white/10 transition-colors shadow-sm">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 mb-8 overflow-x-auto pb-2 transition-colors duration-300">
        <button onClick={() => {setView('dashboard'); setEditPromptId(null);}} className={`px-4 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${view === 'dashboard' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
          <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4"/> Dashboard</span>
        </button>
        <button onClick={() => {setView('submissions'); setEditPromptId(null);}} className={`px-4 py-3 font-bold text-sm border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${view === 'submissions' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
          Submissions {pendingPrompts.length > 0 && <span className="bg-red-500 font-black text-white text-[10px] px-2 py-0.5 rounded-full">{pendingPrompts.length}</span>}
        </button>
        <button onClick={() => {setView('add'); setEditPromptId(null); setAddForm({ title: '', description: '', promptText: '', mediaUrl: '', category: 'Image', tags: '' });}} className={`px-4 py-3 font-bold text-sm border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${view === 'add' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
          <Plus className="w-4 h-4"/> Add Prompt
        </button>
        <button onClick={() => {setView('settings'); setEditPromptId(null);}} className={`px-4 py-3 font-bold text-sm border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${view === 'settings' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
          <Settings className="w-4 h-4"/> Settings
        </button>
        {view === 'edit' && (
          <button className="px-4 py-3 font-bold text-sm border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400">
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

            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-8 rounded-2xl overflow-x-auto shadow-sm transition-colors duration-300">
              <h2 className="text-xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">Manage Approved Prompts</h2>
              <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10">
                      <th className="pb-4 px-4 font-bold">Title & Description</th>
                      <th className="pb-4 px-4 font-bold">Metrics</th>
                      <th className="pb-4 px-4 text-center font-bold">Visibility Flags</th>
                      <th className="pb-4 px-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedPrompts.map(prompt => (
                      <tr key={prompt.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 max-w-[250px] truncate">
                          <div className="font-bold text-sm text-gray-900 dark:text-gray-200 mb-1">{prompt.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{prompt.description}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs font-mono text-gray-600 dark:text-gray-300 font-semibold">{prompt.copyCount} COPIES</div>
                          <div className="text-[10px] uppercase text-gray-400 dark:text-gray-500 mt-1">{prompt.viewCount} VIEWS</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => toggleFlag(prompt.id!, 'isFeatured', prompt.isFeatured)} className={`p-2 rounded border transition-colors ${prompt.isFeatured ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/30' : 'bg-transparent text-gray-400 dark:text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'}`} title="Toggle Featured"><Star className="w-4 h-4"/></button>
                            <button onClick={() => toggleFlag(prompt.id!, 'isTrending', prompt.isTrending)} className={`p-2 rounded border transition-colors ${prompt.isTrending ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-500/30' : 'bg-transparent text-gray-400 dark:text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'}`} title="Toggle Trending"><TrendingUp className="w-4 h-4"/></button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                           <button onClick={() => startEdit(prompt)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors" title="Edit Prompt"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => { if(confirm('Delete prompt?')) deletePrompt(prompt.id!).then(loadData); }} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors" title="Delete Prompt"><X className="w-4 h-4" /></button>
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
