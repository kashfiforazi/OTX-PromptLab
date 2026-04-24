import React from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 pb-20">
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/10 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="container max-w-3xl mx-auto flex flex-col items-center text-center">
          <MessageSquare className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">Contact Us</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl text-lg">Have a question, feedback, or need help? We're here for you. Reach out and we'll get back to you as soon as possible.</p>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-white/10 transition-colors duration-300">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for your message! We'll get back to you soon."); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Name</label>
                <input type="text" placeholder="John Doe" required className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Email</label>
                <input type="email" placeholder="john@example.com" required className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Subject</label>
              <input type="text" placeholder="How can we help?" required className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Message</label>
              <textarea placeholder="Write your message here..." required rows={5} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white resize-none"></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm uppercase tracking-widest text-sm">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>

          <div className="mt-12 pt-12 border-t border-gray-200 dark:border-white/10 flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Direct Contact</h3>
            <a href="mailto:mdkawsarforazi.biz@gmail.com" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">
              <Mail className="w-5 h-5" /> mdkawsarforazi.biz@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
