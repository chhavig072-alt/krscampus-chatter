import { useState, useRef } from 'react';
import { X, Image, BarChart3, Plus, Minus, Upload, Link } from 'lucide-react';
import { getUser, getPosts, savePosts } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreatePost({ open, onClose, onCreated }) {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [imageMode, setImageMode] = useState('file');
  const fileInputRef = useRef(null);

  const user = getUser();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!user || !caption.trim()) return;
    const posts = getPosts();
    const newPost = {
      id: Date.now().toString(),
      username: user.name,
      email: user.email,
      caption: caption.trim(),
      image: imageUrl.trim() || null,
      likes: [],
      comments: [],
      poll: showPoll
        ? {
            options: pollOptions
              .filter((o) => o.trim())
              .map((text) => ({ text: text.trim(), votes: [] })),
          }
        : null,
      createdAt: Date.now(),
    };
    if (newPost.poll && newPost.poll.options.length < 2) {
      newPost.poll = null;
    }
    posts.unshift(newPost);
    savePosts(posts);
    setCaption('');
    setImageUrl('');
    setShowPoll(false);
    setPollOptions(['', '']);
    setImageMode('file');
    onCreated();
    onClose();
  };

  const addOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, '']);
  };

  const removeOption = (i) => {
    if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, idx) => idx !== i));
  };

  const updateOption = (i, val) => {
    const copy = [...pollOptions];
    copy[i] = val;
    setPollOptions(copy);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-card w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Create Post</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={22} />
              </button>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              className="input-field resize-none mb-3"
            />

            {/* Image section */}
            <div className="mb-3">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setImageMode('file')}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${imageMode === 'file' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
                >
                  <Upload size={14} /> Upload
                </button>
                <button
                  onClick={() => setImageMode('url')}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${imageMode === 'url' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
                >
                  <Link size={14} /> URL
                </button>
              </div>
              {imageMode === 'file' ? (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-sm py-2 rounded-xl border border-dashed border-border text-muted-foreground hover:bg-accent transition-colors"
                  >
                    {imageUrl && imageUrl.startsWith('data:') ? '✓ Image selected — click to change' : 'Choose image from device'}
                  </button>
                </>
              ) : (
                <input
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL (optional)"
                  className="input-field text-sm"
                />
              )}
              {imageUrl && (
                <div className="mt-2 relative rounded-xl overflow-hidden">
                  <img src={imageUrl} alt="Preview" className="w-full max-h-48 object-cover rounded-xl" />
                  <button onClick={() => setImageUrl('')} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowPoll(!showPoll)}
                className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-colors ${
                  showPoll ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
                }`}
              >
                <BarChart3 size={16} /> {showPoll ? 'Remove Poll' : 'Add Poll'}
              </button>
            </div>

            {showPoll && (
              <div className="space-y-2 mb-4">
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="input-field text-sm py-2"
                    />
                    {pollOptions.length > 2 && (
                      <button onClick={() => removeOption(i)} className="text-muted-foreground hover:text-destructive">
                        <Minus size={18} />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <button onClick={addOption} className="flex items-center gap-1 text-sm text-primary font-medium">
                    <Plus size={16} /> Add option
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!caption.trim()}
              className="btn-primary w-full disabled:opacity-40"
            >
              Post
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
