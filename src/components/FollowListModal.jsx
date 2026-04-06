import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { getFollowersList, getFollowingList, getProfile, unfollowUser, getUser } from '../utils/storage';
import { useState, useEffect } from 'react';
import { UserMinus } from 'lucide-react';

function UserRow({ email, canUnfollow, onUnfollow }) {
  const profile = getProfile(email);
  const name = profile?.name || email.split('@')[0];
  const photoUrl = profile?.photoUrl;

  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex items-center gap-3">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>
      {canUnfollow && (
        <button
          onClick={() => onUnfollow(email)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
        >
          <UserMinus size={14} /> Unfollow
        </button>
      )}
    </div>
  );
}

export default function FollowListModal({ open, onOpenChange, userEmail, defaultTab = 'followers' }) {
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const currentUser = getUser();

  useEffect(() => {
    if (open) {
      setFollowersList(getFollowersList(userEmail));
      setFollowingList(getFollowingList(userEmail));
    }
  }, [open, userEmail]);

  const handleUnfollow = (targetEmail) => {
    unfollowUser(userEmail, targetEmail);
    setFollowingList((prev) => prev.filter((e) => e !== targetEmail));
    onOpenChange(false);
  };

  const isOwnProfile = currentUser?.email === userEmail;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Connections</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={defaultTab}>
          <TabsList className="w-full">
            <TabsTrigger value="followers" className="flex-1">Followers ({followersList.length})</TabsTrigger>
            <TabsTrigger value="following" className="flex-1">Following ({followingList.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="followers" className="max-h-64 overflow-y-auto">
            {followersList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No followers yet</p>
            ) : (
              <div className="divide-y divide-border">
                {followersList.map((email) => (
                  <UserRow key={email} email={email} canUnfollow={false} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="following" className="max-h-64 overflow-y-auto">
            {followingList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Not following anyone yet</p>
            ) : (
              <div className="divide-y divide-border">
                {followingList.map((email) => (
                  <UserRow key={email} email={email} canUnfollow={isOwnProfile} onUnfollow={handleUnfollow} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
