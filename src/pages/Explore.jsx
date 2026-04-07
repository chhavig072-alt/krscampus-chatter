import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getAllProfiles, getUser } from '../utils/storage';
import { getAllCommunities, joinCommunity } from '../utils/communityStorage';
import PostCard from '../components/PostCard';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Users, User, LogIn } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();
  const user = getUser();

  const loadPosts = () => setPosts(getPosts());

  useEffect(() => {
    loadPosts();
  }, []);

  const q = query.toLowerCase().trim();

  // Filter posts
  const postsWithImages = posts.filter((p) => p.image);
  const filteredImagePosts = q
    ? postsWithImages.filter((p) => (p.text || '').toLowerCase().includes(q) || (p.authorName || '').toLowerCase().includes(q))
    : postsWithImages;
  const filteredTextPosts = q
    ? posts.filter((p) => !p.image && ((p.text || '').toLowerCase().includes(q) || (p.authorName || '').toLowerCase().includes(q)))
    : posts.filter((p) => !p.image);

  // Search communities
  const communities = getAllCommunities();
  const filteredCommunities = q
    ? communities.filter((c) => c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q))
    : communities;

  // Search profiles
  const allProfiles = getAllProfiles();
  const profileEntries = Object.entries(allProfiles);
  const filteredProfiles = q
    ? profileEntries.filter(([email, p]) => (p.name || '').toLowerCase().includes(q) || email.toLowerCase().includes(q))
    : profileEntries;

  const handleJoin = (id) => {
    if (!user) return;
    joinCommunity(id, user.email);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 space-y-3">
          <h1 className="text-xl font-bold text-foreground">Explore</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, communities, people..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {q && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="posts" className="flex-1 text-xs">Posts</TabsTrigger>
                <TabsTrigger value="communities" className="flex-1 text-xs">Communities</TabsTrigger>
                <TabsTrigger value="people" className="flex-1 text-xs">People</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-2 pt-2 pb-20">
        {/* Default view or Posts tab */}
        {(!q || activeTab === 'posts') && (
          <>
            {filteredImagePosts.length === 0 && filteredTextPosts.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                {q ? 'No matching posts found.' : 'Nothing to explore yet.'}
              </p>
            )}
            {filteredImagePosts.length > 0 && (
              <div className="grid grid-cols-3 gap-1 mb-4">
                {filteredImagePosts.map((post) => (
                  <button key={post.id} onClick={() => setSelected(post)} className="aspect-square overflow-hidden rounded-lg">
                    <img src={post.image} alt="" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
            {filteredTextPosts.length > 0 && (
              <div className="space-y-0">
                <p className="text-xs font-medium text-muted-foreground px-2 py-2">Text & Poll Posts</p>
                {filteredTextPosts.map((post) => (
                  <PostCard key={post.id} post={post} onUpdate={loadPosts} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Communities tab */}
        {q && activeTab === 'communities' && (
          <>
            {filteredCommunities.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No communities found.</p>
            )}
            <div className="space-y-3 px-2 pt-2">
              {filteredCommunities.map((c) => {
                const isMember = user && c.members.includes(user.email);
                return (
                  <div
                    key={c.id}
                    className={`bg-card rounded-2xl border border-border p-4 transition-colors ${isMember ? 'cursor-pointer hover:bg-accent/30' : ''}`}
                    onClick={isMember ? () => navigate(`/communities/${c.id}`) : undefined}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{c.name}</h3>
                        {c.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>}
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Users size={12} /> {c.members.length} member{c.members.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {user && !isMember && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleJoin(c.id); }}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <LogIn size={14} /> Join
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* People tab */}
        {q && activeTab === 'people' && (
          <>
            {filteredProfiles.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No people found.</p>
            )}
            <div className="space-y-2 px-2 pt-2">
              {filteredProfiles.map(([email, profile]) => (
                <div key={email} className="flex items-center gap-3 bg-card rounded-2xl border border-border p-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{profile.name || email}</p>
                    {profile.bio && <p className="text-xs text-muted-foreground truncate">{profile.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
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
