import { useState, useEffect, useRef } from 'react';
import { getUser, getPosts, getProfile, saveProfile, getFollowersCount, getFollowingCount } from '../utils/storage';
import PostCard from '../components/PostCard';
import FollowListModal from '../components/FollowListModal';
import { Edit2, Check, FileText, Heart, Camera, Link, Users, UserPlus } from 'lucide-react';

export default function Profile() {
  const user = getUser();
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoMode, setPhotoMode] = useState('file');
  const [followModal, setFollowModal] = useState({ open: false, tab: 'followers' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const profile = getProfile(user.email);
    if (profile) {
      setBio(profile.bio || '');
      setDepartment(profile.department || '');
      setPhotoUrl(profile.photoUrl || '');
    }
    setPosts(getPosts().filter((p) => p.email === user.email));
    setFollowers(getFollowersCount(user.email));
    setFollowing(getFollowingCount(user.email));
  }, []);

  const loadPosts = () => {
    if (user) {
      setPosts(getPosts().filter((p) => p.email === user.email));
      setFollowers(getFollowersCount(user.email));
      setFollowing(getFollowingCount(user.email));
    }
  };

  const handleSave = () => {
    if (!user) return;
    saveProfile(user.email, { bio, department, photoUrl });
    setEditing(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className="flex items-center gap-1 text-sm font-medium text-primary"
          >
            {editing ? <Check size={18} /> : <Edit2 size={18} />}
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
        <div className="bg-card rounded-3xl border border-border p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {editing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera size={20} className="text-white" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground font-sans">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">Roll: {user.rollNumber}</p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Profile Photo</label>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setPhotoMode('file')}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${photoMode === 'file' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
                  >
                    <Camera size={14} /> Upload
                  </button>
                  <button
                    onClick={() => setPhotoMode('url')}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${photoMode === 'url' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
                  >
                    <Link size={14} /> URL
                  </button>
                </div>
                {photoMode === 'file' ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-sm py-2 rounded-xl border border-dashed border-border text-muted-foreground hover:bg-accent transition-colors"
                  >
                    {photoUrl && photoUrl.startsWith('data:') ? '✓ Photo selected — click to change' : 'Choose photo from device'}
                  </button>
                ) : (
                  <input value={photoUrl.startsWith('data:') ? '' : photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." className="input-field text-sm" />
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={2} className="input-field text-sm resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Department</label>
                <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Computer Science" className="input-field text-sm" />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {department && <p className="text-sm text-secondary-foreground bg-secondary inline-block px-3 py-1 rounded-full">{department}</p>}
              {bio && <p className="text-sm text-muted-foreground mt-2">{bio}</p>}
              {!bio && !department && <p className="text-sm text-muted-foreground italic">Tap edit to add your bio and department</p>}
            </div>
          )}

          <div className="flex gap-5 mt-4 pt-4 border-t border-border flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">{posts.length}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <Heart size={16} className="text-destructive" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">
                  {posts.reduce((sum, p) => sum + p.likes.length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
            </div>
            <button onClick={() => setFollowModal({ open: true, tab: 'followers' })} className="flex items-center gap-2 hover:bg-secondary/50 rounded-xl px-2 py-1 transition-colors">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Users size={16} className="text-secondary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-foreground leading-none">{followers}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
            </button>
            <button onClick={() => setFollowModal({ open: true, tab: 'following' })} className="flex items-center gap-2 hover:bg-accent/50 rounded-xl px-2 py-1 transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <UserPlus size={16} className="text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-foreground leading-none">{following}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </button>
          </div>
        </div>

        <p className="text-sm font-semibold text-muted-foreground mb-3">Your Posts</p>
        {posts.length === 0 && <p className="text-sm text-muted-foreground">You haven't posted anything yet.</p>}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdate={loadPosts} />
        ))}
      </div>

      <FollowListModal
        open={followModal.open}
        onOpenChange={(open) => { setFollowModal((m) => ({ ...m, open })); if (!open) loadPosts(); }}
        userEmail={user.email}
        defaultTab={followModal.tab}
      />
    </div>
  );
}
