import { useState, useEffect } from 'react';
import { getUser, getPosts, getProfile, saveProfile } from '../utils/storage';
import PostCard from '../components/PostCard';

import { Edit2, Check } from 'lucide-react';

export default function Profile() {
  const user = getUser();
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (!user) return;
    const profile = getProfile(user.email);
    if (profile) {
      setBio(profile.bio || '');
      setDepartment(profile.department || '');
      setPhotoUrl(profile.photoUrl || '');
    }
    setPosts(getPosts().filter((p) => p.email === user.email));
  }, []);

  const loadPosts = () => {
    if (user) setPosts(getPosts().filter((p) => p.email === user.email));
  };

  const handleSave = () => {
    if (!user) return;
    saveProfile(user.email, { bio, department, photoUrl });
    setEditing(false);
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
        {/* Profile card */}
        <div className="bg-card rounded-3xl border border-border p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground font-sans">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">Roll: {user.rollNumber}</p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Profile Photo URL</label>
                <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." className="input-field text-sm" />
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

          <div className="flex gap-6 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{posts.length}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {posts.reduce((sum, p) => sum + p.likes.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </div>
          </div>
        </div>

        {/* User posts */}
        <p className="text-sm font-semibold text-muted-foreground mb-3">Your Posts</p>
        {posts.length === 0 && <p className="text-sm text-muted-foreground">You haven't posted anything yet.</p>}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdate={loadPosts} />
        ))}
      </div>

      
    </div>
  );
}
