/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdsProvider } from './contexts/AdsContext';
import { AuthProvider } from './contexts/AuthContext';
import { SiteProvider } from './contexts/SiteContext';
import { Logo } from './components/Logo';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ExplorePage = lazy(() => import('./pages/ExplorePage').then(m => ({ default: m.ExplorePage })));
const PromptDetailPage = lazy(() => import('./pages/PromptDetailPage').then(m => ({ default: m.PromptDetailPage })));
const SubmitPage = lazy(() => import('./pages/SubmitPage').then(m => ({ default: m.SubmitPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));

const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
    <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <SiteProvider>
        <AdsProvider>
          <AuthProvider>
            <Router>
            <div className="min-h-screen flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
              <Navbar />
              <main className="flex-1 relative z-10 flex flex-col">
                <Suspense fallback={<SuspenseFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/prompt/:id" element={<PromptDetailPage />} />
                    <Route path="/submit" element={<SubmitPage />} />
                    <Route path="/admin-secret-page" element={<AdminPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                  </Routes>
                </Suspense>
              </main>
              
              {/* Bottom Bar Info */}
            <footer className="relative z-10 min-h-16 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#050505] flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 mt-auto flex-shrink-0 py-4 transition-colors duration-300 gap-4 sm:gap-0">
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
          </AuthProvider>
        </AdsProvider>
      </SiteProvider>
    </ThemeProvider>
  );
}
