import { Link } from 'react-router-dom';
import { Sparkles, Plus, Shield, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './Logo';

export function Navbar() {
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative z-20 h-16 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md transition-colors duration-300">
      <Link to="/" className="mr-0 sm:mr-4 shrink-0 flex items-center">
        <Logo className="scale-90 sm:scale-100" />
      </Link>
      <div className="flex flex-1 items-center justify-end space-x-4">
        <nav className="flex items-center gap-4 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hidden md:block cursor-pointer transition-colors">Explore</span>
          <span className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hidden md:block cursor-pointer transition-colors">Trending</span>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link
            to="/submit"
            className="px-4 sm:px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-semibold rounded-full text-xs sm:text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Submit Prompt</span>
          </Link>
          <div className="w-[1px] h-6 bg-gray-300 dark:bg-white/10"></div>
          {isAdmin ? (
            <Link
              to="/admin-secret-page"
              className="text-xs font-mono text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-400/30 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-400/10 transition-colors flex items-center gap-2"
            >
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">/admin</span>
            </Link>
          ) : (
            <Link
              to="/admin-secret-page"
              className="text-xs font-mono text-gray-400 dark:text-gray-500 border border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:text-gray-600 dark:hover:text-gray-300 px-2 py-1 rounded-full transition-colors hidden sm:block"
            >
              /admin-login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
