import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Prompt } from '../types';
import { PromptCard } from '../components/PromptCard';
import { Loader2, Bookmark, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedPrompts() {
      if (!user) return;
      try {
        const savedRef = collection(db, 'users', user.uid, 'savedPrompts');
        const q = query(savedRef);
        const snapshot = await getDocs(q);
        
        const promptIds = snapshot.docs.map(doc => doc.id);
        const fetchedPrompts: Prompt[] = [];
        
        // Fetch actual prompt details
        for (const promptId of promptIds) {
          const promptDoc = await getDoc(doc(db, 'prompts', promptId));
          if (promptDoc.exists()) {
             fetchedPrompts.push({ id: promptDoc.id, ...promptDoc.data() } as Prompt);
          }
        }
        
        setSavedPrompts(fetchedPrompts);
      } catch (err) {
        console.error("Error fetching saved prompts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSavedPrompts();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Please sign in</h2>
        <p className="text-gray-500 mb-8">You need to sign in to view your profile and saved prompts.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 pb-20">
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/10 pt-16 pb-12 px-4 transition-colors duration-300">
        <div className="container max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-white/10" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-bold">
              {user.displayName?.charAt(0) || user.email?.charAt(0)}
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">{user.displayName}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mb-6">{user.email}</p>
          </div>
          
          <div className="flex gap-4">
            <button onClick={logOut} className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-full font-semibold transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="w-6 h-6 text-blue-600 dark:text-blue-400 focus:outline-none" />
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Saved Prompts</h2>
          <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">{savedPrompts.length}</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : savedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPrompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} onClick={() => navigate(`/prompt/${prompt.slug || prompt.id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10">
            <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">No saved prompts yet</h3>
            <p className="text-gray-500 dark:text-gray-400">When you save prompts, they will appear here for easy access.</p>
          </div>
        )}
      </div>
    </div>
  );
}
