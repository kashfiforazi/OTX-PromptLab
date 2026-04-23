import { motion } from 'framer-motion';

export function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 relative z-10 flex-1">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-sm transition-colors duration-300">
        <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">1. Information We Collect</h2>
            <p>We only collect information you voluntarily provide to us when you submit a prompt, such as the prompt title, description, text, media URLs, and tags. We do not require account creation for browsing or copying public prompts.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">2. How We Use Your Information</h2>
            <p>We use the submitted prompts to display them publicly on Prompt Lab. Admin actions and approvals are used to maintain the quality and safety of our platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk. Your data is stored securely in our cloud databases.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">4. Cookies</h2>
            <p>We use localStorage to save your theme preferences (e.g., Light or Dark mode). We do not use tracking cookies for advertising.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us via our social media channels provided on our About Us page.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
