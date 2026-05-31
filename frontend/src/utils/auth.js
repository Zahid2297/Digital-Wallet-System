export function getStoredUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getPrefsKey(userId) {
  return `nexuspay_prefs_${userId}`;
}

export function loadPrefs(userId) {
  if (!userId) return {};
  const raw = localStorage.getItem(getPrefsKey(userId));
  return raw ? JSON.parse(raw) : {};
}

export function savePrefs(userId, prefs) {
  if (!userId) return;
  localStorage.setItem(getPrefsKey(userId), JSON.stringify(prefs));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}
