import { useState, useEffect } from 'react';
import { getPosts } from '../utils/storage';
import PostCard from '../components/PostCard';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadPosts = () => setPosts(getPosts());

  useEffect(() => {
    loadPosts();
  }, []);

  const postsWithImages = posts.filter((p) => p.image);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Explore</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-2 pt-2 pb-20">
        {postsWithImages.length === 0 && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Nothing to explore yet.</p>
        )}

        {/* Image grid */}
        {postsWithImages.length > 0 && (
          <div className="grid grid-cols-3 gap-1 mb-4">
            {postsWithImages.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelected(post)}
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img src={post.image} alt="" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
              </button>
            ))}
          </div>
        )}

        {/* Text/poll posts */}
        {posts.filter((p) => !p.image).length > 0 && (
          <div className="space-y-0">
            <p className="text-xs font-medium text-muted-foreground px-2 py-2">Text & Poll Posts</p>
            {posts
              .filter((p) => !p.image)
              .map((post) => (
                <PostCard key={post.id} post={post} onUpdate={loadPosts} />
              ))}
          </div>
        )}
      </div>

      {/* Full post modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center text-foreground"
              >
                <X size={18} />
              </button>
              <PostCard post={selected} onUpdate={() => { loadPosts(); setSelected({ ...selected }); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  );
}
