const KEYS = {
  USER: 'krmu_user',
  POSTS: 'krmu_posts',
  PROFILES: 'krmu_profiles',
  FOLLOWS: 'krmu_follows',
};

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USER)) || null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(KEYS.USER);
}

export function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.POSTS)) || [];
  } catch {
    return [];
  }
}

export function savePosts(posts) {
  localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
}

export function getAllProfiles() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.PROFILES)) || {};
  } catch {
    return {};
  }
}

export function getProfile(email) {
  try {
    const profiles = JSON.parse(localStorage.getItem(KEYS.PROFILES)) || {};
    return profiles[email] || null;
  } catch {
    return null;
  }
}

export function saveProfile(email, profile) {
  try {
    const profiles = JSON.parse(localStorage.getItem(KEYS.PROFILES)) || {};
    profiles[email] = profile;
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
  } catch {
    const profiles = { [email]: profile };
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
  }
}

// Follow system — stores { [email]: [list of emails they follow] }
function getFollowsData() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.FOLLOWS)) || {};
  } catch {
    return {};
  }
}

function saveFollowsData(data) {
  localStorage.setItem(KEYS.FOLLOWS, JSON.stringify(data));
}

export function followUser(myEmail, targetEmail) {
  if (myEmail === targetEmail) return;
  const data = getFollowsData();
  if (!data[myEmail]) data[myEmail] = [];
  if (!data[myEmail].includes(targetEmail)) {
    data[myEmail].push(targetEmail);
    saveFollowsData(data);
  }
}

export function unfollowUser(myEmail, targetEmail) {
  const data = getFollowsData();
  if (!data[myEmail]) return;
  data[myEmail] = data[myEmail].filter((e) => e !== targetEmail);
  saveFollowsData(data);
}

export function isFollowing(myEmail, targetEmail) {
  const data = getFollowsData();
  return (data[myEmail] || []).includes(targetEmail);
}

export function getFollowingCount(email) {
  const data = getFollowsData();
  return (data[email] || []).length;
}

export function getFollowersCount(email) {
  const data = getFollowsData();
  let count = 0;
  for (const key of Object.keys(data)) {
    if (data[key].includes(email)) count++;
  }
  return count;
}

export function getFollowingList(email) {
  const data = getFollowsData();
  return data[email] || [];
}

export function getFollowersList(email) {
  const data = getFollowsData();
  const followers = [];
  for (const key of Object.keys(data)) {
    if (data[key].includes(email)) followers.push(key);
  }
  return followers;
}
