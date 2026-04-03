import { useState, useEffect } from 'react';
import { Heart, MessageCircle, BarChart3, Trash2 } from 'lucide-react';
import { getUser } from '../utils/storage';

import { motion, AnimatePresence } from 'framer-motion';

const NOTIF_KEY = 'krmu_notifications';

function getSeedNotifications(userEmail) {
  return [
    { id: '1', type: 'like', from: 'Priya Verma', message: 'liked your post', time: Date.now() - 600000, read: false },
    { id: '2', type: 'comment', from: 'Rohan Gupta', message: 'commented: "Great work!"', time: Date.now() - 1800000, read: false },
    { id: '3', type: 'like', from: 'Neha Singh', message: 'liked your post', time: Date.now() - 3600000, read: true },
    { id: '4', type: 'poll', from: 'Aarav Sharma', message: 'voted on your poll', time: Date.now() - 7200000, read: true },
    { id: '5', type: 'comment', from: 'Priya Verma', message: 'commented: "Love this campus shot 📸"', time: Date.now() - 14400000, read: true },
  ];
}

function getNotifications(email) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY)) || {};
    return all[email] || null;
  } catch { return null; }
}

function saveNotifications(email, notifs) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY)) || {};
    all[email] = notifs;
    localStorage.setItem(NOTIF_KEY, JSON.stringify(all));
  } catch {
    localStorage.setItem(NOTIF_KEY, JSON.stringify({ [email]: notifs }));
  }
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  poll: BarChart3,
};

const colorMap = {
  like: 'text-primary bg-primary/10',
  comment: 'text-sage bg-sage-light',
  poll: 'text-accent-foreground bg-accent',
};

export default function Notifications() {
  const user = getUser();
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (!user) return;
    let data = getNotifications(user.email);
    if (!data) {
      data = getSeedNotifications(user.email);
      saveNotifications(user.email, data);
    }
    setNotifs(data);
  }, []);

  const markAllRead = () => {
    if (!user) return;
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setNotifs(updated);
    saveNotifications(user.email, updated);
  };

  const deleteNotif = (id) => {
    if (!user) return;
    const updated = notifs.filter((n) => n.id !== id);
    setNotifs(updated);
    saveNotifications(user.email, updated);
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs font-medium text-primary">
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-2 pb-20">
        {notifs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Heart size={48} strokeWidth={1.2} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs mt-1">When someone interacts with your posts, you'll see it here.</p>
          </div>
        )}

        <AnimatePresence>
          {notifs.map((n) => {
            const Icon = iconMap[n.type] || Heart;
            const color = colorMap[n.type] || colorMap.like;
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={`flex items-center gap-3 p-4 rounded-2xl mb-2 transition-colors ${
                  n.read ? 'bg-card' : 'bg-coral-light border border-primary/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{n.from}</span>{' '}
                    <span className="text-muted-foreground">{n.message}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(n.time)}</p>
                </div>
                <button onClick={() => deleteNotif(n.id)} className="text-muted-foreground/40 hover:text-destructive shrink-0">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      
    </div>
  );
}
