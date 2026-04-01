const KEYS = {
  USER: 'krmu_user',
  POSTS: 'krmu_posts',
  PROFILES: 'krmu_profiles',
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
