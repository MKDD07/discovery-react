// Simple client-side auth state manager synced with localStorage & custom events

export interface UserProfile {
  id?: string | number;
  name?: string | null;
  email: string;
  phone?: string;
  avatar?: string;
  joinedAt?: string;
  bookingsCount?: number;
  savedToursCount?: number;
}

const AUTH_STORAGE_KEY = "discovery_auth_user";

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    window.dispatchEvent(new Event("auth_state_changed"));
  } catch (err) {
    console.error("Failed to store auth user:", err);
  }
}

export function logoutUser() {
  setStoredUser(null);
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}
