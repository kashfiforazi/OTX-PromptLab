import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export function SaveButton({ promptId, className }: { promptId: string, className?: string }) {
  const { user, signIn } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSaved() {
      if (!user) {
        setIsSaved(false);
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'users', user.uid, 'savedPrompts', promptId);
        const docSnap = await getDoc(docRef);
        setIsSaved(docSnap.exists());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    checkSaved();
  }, [user, promptId]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      await signIn();
      return;
    }
    try {
      const docRef = doc(db, 'users', user.uid, 'savedPrompts', promptId);
      if (isSaved) {
        await deleteDoc(docRef);
        setIsSaved(false);
      } else {
        await setDoc(docRef, { savedAt: new Date() });
        setIsSaved(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={toggleSave}
      title={isSaved ? "Remove from saved" : "Save prompt"}
      className={`p-2.5 rounded-full transition-all flex items-center justify-center ${className} ${
        isSaved 
          ? 'bg-blue-100 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/40' 
          : 'bg-white/80 dark:bg-black/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/20 border-gray-300 dark:border-white/20'
      } border shadow-sm backdrop-blur-md`}
    >
      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
    </button>
  );
}
