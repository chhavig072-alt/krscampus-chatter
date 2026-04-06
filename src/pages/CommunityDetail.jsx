import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, getProfile } from '../utils/storage';
import {
  getCommunity, getCommunityMessages, sendCommunityMessage, deleteMessage,
  isMember, isAdmin, removeMember, promoteToAdmin, deleteCommunity,
} from '../utils/communityStorage';
import { ArrowLeft, Send, Trash2, Shield, UserMinus, Users, Crown, MoreVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';

export default function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [community, setCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef(null);

  const refresh = () => {
    setCommunity(getCommunity(id));
    setMessages(getCommunityMessages(id));
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!user || !community) return null;
  if (!community.members.includes(user.email)) {
    navigate('/communities');
    return null;
  }

  const userIsAdmin = isAdmin(id, user.email);
  const isCreator = community.creatorEmail === user.email;

  const handleSend = () => {
    if (!text.trim()) return;
    sendCommunityMessage(id, { email: user.email, name: user.name, text: text.trim() });
    setText('');
    refresh();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeleteMessage = (msgId) => {
    deleteMessage(id, msgId);
    refresh();
  };

  const handleRemoveMember = (email) => {
    removeMember(id, email);
    refresh();
  };

  const handlePromote = (email) => {
    promoteToAdmin(id, email);
    refresh();
  };

  const handleDeleteCommunity = () => {
    if (confirm('Delete this community permanently?')) {
      deleteCommunity(id);
      navigate('/communities');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/communities')} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-foreground truncate">{community.name}</h1>
          <p className="text-xs text-muted-foreground">{community.members.length} members</p>
        </div>
        <button onClick={() => setShowMembers(true)} className="text-muted-foreground hover:text-foreground transition-colors">
          <Users size={20} />
        </button>
        {isCreator && (
          <Popover>
            <PopoverTrigger className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreVertical size={20} />
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1">
              <button onClick={handleDeleteCommunity} className="w-full text-left text-sm px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2">
                <Trash2 size={14} /> Delete Community
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">No messages yet. Say hello! 👋</p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.email === user.email;
          const profile = getProfile(msg.email);
          const photoUrl = profile?.photoUrl;
          return (
            <div key={msg.id} className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
              {!isOwn && (
                photoUrl ? (
                  <img src={photoUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-1" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-1">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                )
              )}
              <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                {!isOwn && <p className="text-xs text-muted-foreground mb-0.5 px-1">{msg.name}</p>}
                <div className={`relative group rounded-2xl px-3 py-2 text-sm ${isOwn ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-border text-foreground rounded-tl-sm'}`}>
                  {msg.text}
                  {(isOwn || userIsAdmin) && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground rounded-full p-1 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="input-field text-sm flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-primary text-primary-foreground p-2.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Members Dialog */}
      <Dialog open={showMembers} onOpenChange={setShowMembers}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Members ({community.members.length})</DialogTitle>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto divide-y divide-border">
            {community.members.map((email) => {
              const profile = getProfile(email);
              const name = profile?.name || email.split('@')[0];
              const photoUrl = profile?.photoUrl;
              const memberIsAdmin = community.admins.includes(email);
              const memberIsCreator = community.creatorEmail === email;
              return (
                <div key={email} className="flex items-center justify-between py-3 px-1">
                  <div className="flex items-center gap-3">
                    {photoUrl ? (
                      <img src={photoUrl} alt={name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        {name}
                        {memberIsCreator && <Crown size={12} className="text-yellow-500" />}
                        {memberIsAdmin && !memberIsCreator && <Shield size={12} className="text-primary" />}
                      </p>
                      <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                  </div>
                  {userIsAdmin && !memberIsCreator && email !== user.email && (
                    <div className="flex gap-1">
                      {!memberIsAdmin && (
                        <button onClick={() => handlePromote(email)} className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Promote to admin">
                          <Shield size={14} />
                        </button>
                      )}
                      <button onClick={() => handleRemoveMember(email)} className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Remove member">
                        <UserMinus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
