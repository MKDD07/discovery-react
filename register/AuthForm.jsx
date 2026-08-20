import { useState, useEffect, createContext, useContext } from "react";

const API_BASE = "https://discovery-convoy-auth.YOUR_SUBDOMAIN.workers.dev";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/me`, { credentials: "include" });
      const data = await res.json();
      setUser(res.ok ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const signup = async (email, password, name) => {
    const res = await fetch(`${API_BASE}/api/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await fetch(`${API_BASE}/api/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function AuthForm() {
  const { user, login, signup, logout } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup(email, password, name);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <div className="max-w-sm mx-auto p-6 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-medium mb-4">{user.email}</p>
        <button
          onClick={logout}
          className="w-full py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto p-6 rounded-xl border border-gray-200">
      <div className="flex gap-4 mb-6 text-sm font-medium">
        <button
          onClick={() => setMode("login")}
          className={mode === "login" ? "text-gray-900 border-b-2 border-gray-900 pb-1" : "text-gray-400 pb-1"}
        >
          Log in
        </button>
        <button
          onClick={() => setMode("signup")}
          className={mode === "signup" ? "text-gray-900 border-b-2 border-gray-900 pb-1" : "text-gray-400 pb-1"}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
