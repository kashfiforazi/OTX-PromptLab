import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy, limit, increment, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError } from '../services/firebase';
import type { Prompt, PromptStatus } from '../types';

const PROMPTS_COLLECTION = 'prompts';

export async function fetchPrompts(status: PromptStatus = 'approved', maxLimit = 50) {
  try {
    const q = query(
      collection(db, PROMPTS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
      limit(maxLimit)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now()
      } as Prompt;
    });
  } catch (error) {
    return handleFirestoreError(error, 'list', PROMPTS_COLLECTION);
  }
}

export async function submitPrompt(prompt: Omit<Prompt, 'id' | 'viewCount' | 'copyCount' | 'createdAt' | 'updatedAt'>) {
  try {
    const newPrompt = {
      ...prompt,
      viewCount: 0,
      copyCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, PROMPTS_COLLECTION), newPrompt);
    return docRef.id;
  } catch (error) {
    return handleFirestoreError(error, 'create', PROMPTS_COLLECTION);
  }
}

export async function incrementViews(promptId: string) {
  try {
    const promptRef = doc(db, PROMPTS_COLLECTION, promptId);
    await updateDoc(promptRef, {
      viewCount: increment(1),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("View increment error, ignoring for anonymous users", error);
    // Ignore error for anonymous users who might not have update permissions based on rules
  }
}

export async function incrementCopies(promptId: string) {
  try {
    const promptRef = doc(db, PROMPTS_COLLECTION, promptId);
    await updateDoc(promptRef, {
      copyCount: increment(1),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Copy increment error", error);
  }
}

export async function updatePromptStatus(promptId: string, status: PromptStatus) {
  try {
    const promptRef = doc(db, PROMPTS_COLLECTION, promptId);
    await updateDoc(promptRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    return handleFirestoreError(error, 'update', `prompts/${promptId}`);
  }
}

export async function updatePrompt(promptId: string, data: Partial<Prompt>) {
  try {
    const promptRef = doc(db, PROMPTS_COLLECTION, promptId);
    await updateDoc(promptRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    return handleFirestoreError(error, 'update', `prompts/${promptId}`);
  }
}

export async function deletePrompt(promptId: string) {
  try {
    await deleteDoc(doc(db, PROMPTS_COLLECTION, promptId));
  } catch (error) {
    return handleFirestoreError(error, 'delete', `prompts/${promptId}`);
  }
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  discord?: string;
  youtube?: string;
  aboutText?: string;
}

export interface AdsSettings {
  googleAdClient?: string;
  googleAdSlotHead?: string;
  googleAdSlotSidebar?: string;
  googleAdSlotFooter?: string;
  enabled?: boolean;
}

export async function getSocialLinks(): Promise<SocialLinks> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'social'));
    if (docSnap.exists()) {
      return docSnap.data() as SocialLinks;
    }
  } catch (error) {
    console.error("Error fetching social links", error);
  }
  return {};
}

export async function updateSocialLinks(links: SocialLinks) {
  try {
    // getDoc first to know if we need to addDoc or updateDoc, wait, we can just use setDoc with merge: true
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'settings', 'social'), links, { merge: true });
  } catch (error) {
    return handleFirestoreError(error, 'update', 'settings/social');
  }
}

export async function getAdsSettings(): Promise<AdsSettings> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'ads'));
    if (docSnap.exists()) {
      return docSnap.data() as AdsSettings;
    }
  } catch (error) {
    console.error("Error fetching ads settings", error);
  }
  return {};
}

export async function updateAdsSettings(settings: AdsSettings) {
  try {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'settings', 'ads'), settings, { merge: true });
  } catch (error) {
    return handleFirestoreError(error, 'update', 'settings/ads');
  }
}

export interface SiteSettings {
  logoUrl?: string;
  siteName?: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'site'));
    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }
  } catch (error) {
    console.error("Error fetching site settings", error);
  }
  return {};
}

export async function updateSiteSettings(settings: SiteSettings) {
  try {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'settings', 'site'), settings, { merge: true });
  } catch (error) {
    return handleFirestoreError(error, 'update', 'settings/site');
  }
}

export interface Banner {
  imageUrl: string;
  link: string;
  title: string;
}

export async function getBanners(): Promise<Banner[]> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'banners'));
    if (docSnap.exists()) {
      return (docSnap.data().items || []) as Banner[];
    }
  } catch (error) {
    console.error("Error fetching banners", error);
  }
  return [];
}

export async function updateBanners(banners: Banner[]) {
  try {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'settings', 'banners'), { items: banners }, { merge: true });
  } catch (error) {
    return handleFirestoreError(error, 'update', 'settings/banners');
  }
}
