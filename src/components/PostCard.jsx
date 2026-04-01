import { useState } from 'react';
import { Heart, MessageCircle, BarChart3 } from 'lucide-react';
import { getUser, getPosts, savePosts } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function PostCard({ post, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const user = getUser();

  const isLiked = user && post.likes.includes(user.email);
  const totalVotes = post.poll
    ? post.poll.options.reduce((sum, o) => sum + o.votes.length, 0)
    : 0;

  const handleLike = () => {
    if (!user) return;
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === post.id);
    if (idx === -1) return;
    if (isLiked) {
      posts[idx].likes = posts[idx].likes.filter((e) => e !== user.email);
    } else {
      posts[idx].likes.push(user.email);
    }
    savePosts(posts);
    onUpdate();
  };

  const handleComment = () => {
    if (!user || !commentText.trim()) return;
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === post.id);
    if (idx === -1) return;
    posts[idx].comments.push({
      username: user.name,
      email: user.email,
      text: commentText.trim(),
    });
    savePosts(posts);
    setCommentText('');
    onUpdate();
  };

  const handleVote = (optionIdx) => {
    if (!user || !post.poll) return;
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === post.id);
    if (idx === -1) return;
    const poll = posts[idx].poll;
    const alreadyVoted = poll.options.some((o) => o.votes.includes(user.email));
    if (alreadyVoted) return;
    poll.options[optionIdx].votes.push(user.email);
    savePosts(posts);
    onUpdate();
  };

  const hasVoted = user && post.poll && post.poll.options.some((o) => o.votes.includes(user.email));

  return (
    <motion.div
      className="card-post"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-foreground">{post.username}</p>
          <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full aspect-[4/3] object-cover"
          loading="lazy"
        />
      )}

      {/* Caption */}
      <div className="px-4 pt-3">
        <p className="text-sm leading-relaxed text-foreground">{post.caption}</p>
      </div>

      {/* Poll */}
      {post.poll && (
        <div className="px-4 pt-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
            <BarChart3 size={14} /> Poll
          </div>
          {post.poll.options.map((option, i) => {
            const pct = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
            const isMyVote = user && option.votes.includes(user.email);
            return (
              <button
                key={i}
                onClick={() => handleVote(i)}
                disabled={hasVoted}
                className={`relative w-full text-left rounded-xl px-4 py-2.5 text-sm font-medium transition-all overflow-hidden border ${
                  isMyVote
                    ? 'border-primary bg-primary/5 text-primary'
                    : hasVoted
                    ? 'border-border bg-muted/50 text-foreground'
                    : 'border-border bg-card hover:border-primary/40 text-foreground'
                }`}
              >
                {hasVoted && (
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/10 rounded-xl transition-all"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <span className="relative z-10 flex justify-between">
                  <span>{option.text}</span>
                  {hasVoted && <span className="text-muted-foreground">{pct}%</span>}
                </span>
              </button>
            );
          })}
          <p className="text-xs text-muted-foreground">{totalVotes} vote{totalVotes !== 1 && 's'}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-3">
        <button onClick={handleLike} className="flex items-center gap-1.5 transition-colors">
          <Heart
            size={20}
            className={isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}
          />
          <span className="text-sm text-muted-foreground">{post.likes.length}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-muted-foreground"
        >
          <MessageCircle size={20} />
          <span className="text-sm">{post.comments.length}</span>
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {post.comments.length === 0 && (
                <p className="text-xs text-muted-foreground">No comments yet</p>
              )}
              {post.comments.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-sage-light flex items-center justify-center text-sage text-xs font-bold shrink-0">
                    {c.username.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground">{c.username}</span>
                    <p className="text-xs text-muted-foreground">{c.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  placeholder="Add a comment..."
                  className="input-field text-sm py-2"
                />
                <button onClick={handleComment} className="btn-primary text-sm py-2 px-4">
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
