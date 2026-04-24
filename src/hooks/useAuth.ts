import { useAuth as useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const { user, loading, signIn, signInWithEmail, signUpWithEmail, logOut } = useAuthContext();
  
  // Real check based on email configured in rules
  const isAdmin = user != null && user.email === 'mdkawsarforazi.biz@gmail.com';

  return { user, loading, isAdmin, signIn, signInWithEmail, signUpWithEmail, logOut };
}
