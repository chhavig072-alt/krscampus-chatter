import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getPosts } from '../utils/storage';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const loadPosts = () => setPosts(getPosts());

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">KRMU TALKS</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-all active:scale-90"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="feed-container">
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No posts yet. Be the first to share!</p>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdate={loadPosts} />
        ))}
      </div>

      <CreatePost open={showCreate} onClose={() => setShowCreate(false)} onCreated={loadPosts} />
      <BottomNav />
    </div>
  );
}
