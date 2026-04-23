import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  increment,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Helper for error handling as requested in guidelines
export const handleFirestoreError = (error: unknown, operationType: string, path: string | null = null) => {
  const currentUser = auth.currentUser;
  const errorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: currentUser ? {
      userId: currentUser.uid,
      email: currentUser.email || '',
      emailVerified: currentUser.emailVerified,
      isAnonymous: currentUser.isAnonymous,
      providerInfo: currentUser.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName || '',
        email: p.email || ''
      }))
    } : null
  };
  console.error("Firestore Error:", JSON.stringify(errorInfo, null, 2));
  throw new Error(JSON.stringify(errorInfo));
};
