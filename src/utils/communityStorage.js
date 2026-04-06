const KEYS = {
  COMMUNITIES: 'krmu_communities',
  COMMUNITY_MESSAGES: 'krmu_community_messages',
};

function getCommunities() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.COMMUNITIES)) || [];
  } catch {
    return [];
  }
}

function saveCommunities(communities) {
  localStorage.setItem(KEYS.COMMUNITIES, JSON.stringify(communities));
}

export function getAllCommunities() {
  return getCommunities();
}

export function getCommunity(id) {
  return getCommunities().find((c) => c.id === id) || null;
}

export function createCommunity({ name, description, creatorEmail }) {
  const communities = getCommunities();
  const community = {
    id: 'comm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    name,
    description,
    creatorEmail,
    admins: [creatorEmail],
    members: [creatorEmail],
    createdAt: new Date().toISOString(),
  };
  communities.push(community);
  saveCommunities(communities);
  return community;
}

export function joinCommunity(communityId, email) {
  const communities = getCommunities();
  const c = communities.find((x) => x.id === communityId);
  if (!c) return;
  if (!c.members.includes(email)) {
    c.members.push(email);
    saveCommunities(communities);
  }
}

export function leaveCommunity(communityId, email) {
  const communities = getCommunities();
  const c = communities.find((x) => x.id === communityId);
  if (!c) return;
  c.members = c.members.filter((m) => m !== email);
  c.admins = c.admins.filter((a) => a !== email);
  saveCommunities(communities);
}

export function deleteCommunity(communityId) {
  const communities = getCommunities().filter((c) => c.id !== communityId);
  saveCommunities(communities);
  // Also delete messages
  const allMessages = getAllMessages();
  delete allMessages[communityId];
  localStorage.setItem(KEYS.COMMUNITY_MESSAGES, JSON.stringify(allMessages));
}

export function isMember(communityId, email) {
  const c = getCommunity(communityId);
  return c ? c.members.includes(email) : false;
}

export function isAdmin(communityId, email) {
  const c = getCommunity(communityId);
  return c ? c.admins.includes(email) : false;
}

export function promoteToAdmin(communityId, email) {
  const communities = getCommunities();
  const c = communities.find((x) => x.id === communityId);
  if (!c || !c.members.includes(email)) return;
  if (!c.admins.includes(email)) {
    c.admins.push(email);
    saveCommunities(communities);
  }
}

export function removeMember(communityId, email) {
  const communities = getCommunities();
  const c = communities.find((x) => x.id === communityId);
  if (!c) return;
  c.members = c.members.filter((m) => m !== email);
  c.admins = c.admins.filter((a) => a !== email);
  saveCommunities(communities);
}

// Messages
function getAllMessages() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.COMMUNITY_MESSAGES)) || {};
  } catch {
    return {};
  }
}

export function getCommunityMessages(communityId) {
  return getAllMessages()[communityId] || [];
}

export function sendCommunityMessage(communityId, { email, name, text }) {
  const allMessages = getAllMessages();
  if (!allMessages[communityId]) allMessages[communityId] = [];
  allMessages[communityId].push({
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    email,
    name,
    text,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(KEYS.COMMUNITY_MESSAGES, JSON.stringify(allMessages));
}

export function deleteMessage(communityId, messageId) {
  const allMessages = getAllMessages();
  if (!allMessages[communityId]) return;
  allMessages[communityId] = allMessages[communityId].filter((m) => m.id !== messageId);
  localStorage.setItem(KEYS.COMMUNITY_MESSAGES, JSON.stringify(allMessages));
}
