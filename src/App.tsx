/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SubmitPage } from './pages/SubmitPage';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AboutPage } from './pages/AboutPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { Logo } from './components/Logo';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
          <Navbar />
          <main className="flex-1 relative z-10 flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/admin-secret-page" element={<AdminPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          
          {/* Bottom Bar Info */}
          <footer className="relative z-10 min-h-20 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#050505] flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 mt-auto flex-shrink-0 py-6 sm:py-4 transition-colors duration-300 gap-5 sm:gap-0">
            <div className="flex items-center gap-6">
              <Link to="/" className="cursor-pointer">
                <Logo showWordmark={true} className="scale-90 sm:scale-100 mt-1 sm:mt-0" />
              </Link>
              
              <div className="hidden md:flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-6 h-8 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">System Online</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
              <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}
