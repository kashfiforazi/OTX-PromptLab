import { useAuth as useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const { user, loading, signIn, signInWithEmail, signUpWithEmail, logOut } = useAuthContext();
  
  // Real check based on email configured in rules
  const isAdmin = user != null && (user.email?.toLowerCase() === 'mdkawsarforazi.biz@gmail.com' || user.email?.toLowerCase() === 'mrrakib9xhub@gmail.com');

  return { user, loading, isAdmin, signIn, signInWithEmail, signUpWithEmail, logOut };
}
