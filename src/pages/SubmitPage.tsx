import { useState } from 'react';
import { submitPrompt } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export function SubmitPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    promptText: '',
    mediaUrl: '',
    category: 'Image',
    tags: ''
  });

  const categories = ['Image', 'Video', 'Logo', 'Gaming', 'Banner', 'Thumbnail', 'Code', 'Writing'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitPrompt({
        title: formData.title,
        description: formData.description,
        promptText: formData.promptText,
        mediaUrl: formData.mediaUrl || undefined,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: 'pending',
        isFeatured: false,
        isTrending: false
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12 relative z-10 flex-1">
      <button 
        onClick={() => navigate('-1')} 
        className="flex items-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-lg relative overflow-hidden backdrop-blur-md transition-colors duration-300"
      >
        {/* Subtle mesh inside card */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none transition-colors duration-300"></div>

        <div className="mb-8 relative z-10">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Submit a Prompt</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors duration-300">Share your creative workflow with the community. All submissions are reviewed by our mod team.</p>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 p-6 rounded-2xl text-center relative z-10 transition-colors duration-300">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              <Check className="w-6 h-6" />
              Success!
            </h3>
            <p className="text-sm font-medium">Your prompt has been submitted and is under review. Redirecting to home...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium transition-colors duration-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold transition-colors duration-300">Title</label>
              <input
                required
                maxLength={100}
                placeholder="E.g. Cyberpunk Cityscapes, React Header..."
                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold transition-colors duration-300">Description</label>
              <textarea
                required
                maxLength={500}
                rows={3}
                placeholder="What does this prompt do? Give a brief overview."
                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none text-sm"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold transition-colors duration-300">The Actual Prompt</label>
              <textarea
                required
                maxLength={5000}
                rows={6}
                placeholder="Paste the exact prompt here..."
                className="w-full bg-gray-50 dark:bg-black/50 font-mono text-sm border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.promptText}
                onChange={e => setFormData({ ...formData, promptText: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold transition-colors duration-300">Category</label>
                <select
                  className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none text-sm cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold transition-colors duration-300">Media URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/preview.mp4 or .png"
                  className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  value={formData.mediaUrl}
                  onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold transition-colors duration-300">Tags (Comma separated)</label>
              <input
                placeholder="midjourney, concept art, neon"
                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-black py-4 px-4 rounded-xl flex items-center justify-center transition-all shadow-md disabled:opacity-70 mt-8 uppercase tracking-widest text-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit for Review'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
