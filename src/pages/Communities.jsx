import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/storage';
import { getAllCommunities, createCommunity, joinCommunity, leaveCommunity, isMember } from '../utils/communityStorage';
import { Plus, Users, LogIn, LogOut as LeaveIcon, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export default function Communities() {
  const user = getUser();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const refresh = () => setCommunities(getAllCommunities());

  useEffect(() => { refresh(); }, []);

  const handleCreate = () => {
    if (!name.trim() || !user) return;
    createCommunity({ name: name.trim(), description: description.trim(), creatorEmail: user.email });
    setName('');
    setDescription('');
    setShowCreate(false);
    refresh();
  };

  const handleJoin = (id) => {
    if (!user) return;
    joinCommunity(id, user.email);
    refresh();
  };

  const handleLeave = (id) => {
    if (!user) return;
    leaveCommunity(id, user.email);
    refresh();
  };

  if (!user) return null;

  const myCommunities = communities.filter((c) => c.members.includes(user.email));
  const otherCommunities = communities.filter((c) => !c.members.includes(user.email));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-20">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-foreground">Communities</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 text-sm font-medium text-primary-foreground bg-primary px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Create
          </button>
        </div>

        {myCommunities.length > 0 && (
          <>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Communities</p>
            <div className="space-y-3 mb-6">
              {myCommunities.map((c) => (
                <CommunityCard key={c.id} community={c} userEmail={user.email} onOpen={() => navigate(`/communities/${c.id}`)} onLeave={() => handleLeave(c.id)} />
              ))}
            </div>
          </>
        )}

        {otherCommunities.length > 0 && (
          <>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Discover</p>
            <div className="space-y-3">
              {otherCommunities.map((c) => (
                <CommunityCard key={c.id} community={c} userEmail={user.email} onJoin={() => handleJoin(c.id)} />
              ))}
            </div>
          </>
        )}

        {communities.length === 0 && (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">No communities yet. Create one to get started!</p>
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Community</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Community name" className="input-field text-sm" maxLength={50} />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this community about?" rows={2} className="input-field text-sm resize-none" maxLength={200} />
            <button onClick={handleCreate} disabled={!name.trim()} className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              Create Community
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CommunityCard({ community, userEmail, onOpen, onJoin, onLeave }) {
  const member = community.members.includes(userEmail);
  const isCreator = community.creatorEmail === userEmail;

  return (
    <div
      className={`bg-card rounded-2xl border border-border p-4 transition-colors ${member ? 'cursor-pointer hover:bg-accent/30' : ''}`}
      onClick={member ? onOpen : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm truncate">{community.name}</h3>
            {isCreator && <Crown size={14} className="text-yellow-500 shrink-0" />}
          </div>
          {community.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{community.description}</p>}
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Users size={12} /> {community.members.length} member{community.members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          {!member && onJoin && (
            <button onClick={onJoin} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <LogIn size={14} /> Join
            </button>
          )}
          {member && !isCreator && onLeave && (
            <button onClick={onLeave} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LeaveIcon size={14} /> Leave
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
