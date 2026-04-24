import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Shield, Moon, Sun, User as UserIcon, LogOut, MoreVertical, Home, Compass, Mail, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './Logo';

export function Navbar() {
  const { user, isAdmin, signIn, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickCountRef.current += 1;
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      navigate('/admin-secret-page');
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current > 0 && clickCountRef.current < 3) {
             navigate('/');
        }
        clickCountRef.current = 0;
      }, 400);
    }
  };

  return (
    <header className="relative z-20 min-h-16 py-3 sm:py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md transition-colors duration-300">
      <Link 
        to="/"
        onClick={handleLogoClick} 
        className="mr-0 sm:mr-4 shrink-0 flex items-center cursor-pointer"
      >
        <Logo className="scale-90 sm:scale-100 pointer-events-none" />
      </Link>
      <div className="flex flex-1 items-center justify-end space-x-4">
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link to="/explore" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hidden md:block cursor-pointer transition-colors">Explore</Link>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link
            to="/submit"
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full text-xs sm:text-sm hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Submit</span>
          </Link>

          <div className="w-[1px] h-6 bg-gray-300 dark:bg-white/10"></div>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111] rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden z-50 flex flex-col py-2"
              >
                {user && (
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 mb-2 flex items-center gap-3">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.displayName || 'User'}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                  </div>
                )}

                <Link 
                  to="/" 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Home className="w-5 h-5 text-blue-500" /> Home
                </Link>
                <Link 
                  to="/explore" 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm md:hidden font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Compass className="w-5 h-5 text-purple-500" /> Prompt
                </Link>

                {user && (
                  <Link 
                    to="/profile" 
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <UserIcon className="w-5 h-5 text-green-500" /> Profile
                  </Link>
                )}

                <Link 
                  to="/about" 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Mail className="w-5 h-5 text-amber-500" /> About Us
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin-secret-page"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <Shield className="w-5 h-5 text-red-500" /> Admin Panel
                  </Link>
                )}
                
                <div className="border-t border-gray-100 dark:border-white/10 mt-1 pt-1">
                  {user ? (
                    <button 
                      onClick={() => { logOut(); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5 text-red-600" /> Sign Out
                    </button>
                  ) : (
                    <button 
                      onClick={() => { navigate('/auth'); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                    >
                      <LogIn className="w-5 h-5 text-blue-500" /> Login / Register
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
}
