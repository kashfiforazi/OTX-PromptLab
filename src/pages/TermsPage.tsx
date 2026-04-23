import { motion } from 'framer-motion';

export function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 relative z-10 flex-1">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-sm transition-colors duration-300">
        <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Prompt Lab, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access our service.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">2. Content Submissions</h2>
            <p>By submitting a prompt, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service. You retain any and all of your rights to any content you submit, but the service is public by nature.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">3. Prohibited Content</h2>
            <p>You may not submit prompts that are illegal, offensive, harassing, or violate the intellectual property rights of others. We reserve the right to reject or remove any prompt without prior notice.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">4. Disclaimer</h2>
            <p>Our Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the accuracy or reliability of the prompts or the platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">5. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
