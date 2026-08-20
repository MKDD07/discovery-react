// Discovery Convoy — Auth Worker
// Routes: POST /api/signup, POST /api/login, GET /api/me, POST /api/logout

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      ...extraHeaders,
    },
  });
}

// ---------- password hashing (PBKDF2, Web Crypto — no deps) ----------
async function hashPassword(password, saltB64) {
  const enc = new TextEncoder();
  const salt = saltB64
    ? Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(bits)));
  const saltOut = btoa(String.fromCharCode(...salt));
  return { hash: hashB64, salt: saltOut };
}

async function verifyPassword(password, saltB64, hashB64) {
  const { hash } = await hashPassword(password, saltB64);
  return hash === hashB64;
}

// ---------- session tokens (HMAC-signed, stateless) ----------
async function signToken(payload, secret) {
  const enc = new TextEncoder();
  const body = btoa(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${body}.${sigB64}`;
}

async function verifyToken(token, secret) {
  if (!token || !token.includes(".")) return null;
  const [body, sigB64] = token.split(".");
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expectedSig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  const expectedSigB64 = btoa(String.fromCharCode(...new Uint8Array(expectedSig)));
  if (expectedSigB64 !== sigB64) return null;
  try {
    const payload = JSON.parse(atob(body));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

// ---------- routes ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "OPTIONS") return json({}, 204);

    if (pathname === "/api/signup" && request.method === "POST") {
      return handleSignup(request, env);
    }
    if (pathname === "/api/login" && request.method === "POST") {
      return handleLogin(request, env);
    }
    if (pathname === "/api/me" && request.method === "GET") {
      return handleMe(request, env);
    }
    if (pathname === "/api/logout" && request.method === "POST") {
      return json({ ok: true }, 200, {
        "Set-Cookie": "session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0",
      });
    }

    return json({ error: "Not found" }, 404);
  },
};

async function handleSignup(request, env) {
  const { email, password, name } = await request.json().catch(() => ({}));
  if (!email || !password) return json({ error: "Email and password required" }, 400);
  if (password.length < 8) return json({ error: "Password must be at least 8 characters" }, 400);

  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email.toLowerCase())
    .first();
  if (existing) return json({ error: "Email already registered" }, 409);

  const { hash, salt } = await hashPassword(password);
  const now = Date.now();

  const result = await env.DB.prepare(
    "INSERT INTO users (email, name, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(email.toLowerCase(), name || null, hash, salt, now)
    .run();

  const userId = result.meta.last_row_id;
  const token = await signToken(
    { sub: userId, email: email.toLowerCase(), exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS },
    env.SESSION_SECRET
  );

  return json(
    { user: { id: userId, email: email.toLowerCase(), name: name || null } },
    201,
    { "Set-Cookie": `session=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${TOKEN_TTL_SECONDS}` }
  );
}

async function handleLogin(request, env) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) return json({ error: "Email and password required" }, 400);

  const user = await env.DB.prepare(
    "SELECT id, email, name, password_hash, password_salt FROM users WHERE email = ?"
  )
    .bind(email.toLowerCase())
    .first();

  if (!user) return json({ error: "Invalid email or password" }, 401);

  const valid = await verifyPassword(password, user.password_salt, user.password_hash);
  if (!valid) return json({ error: "Invalid email or password" }, 401);

  const token = await signToken(
    { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS },
    env.SESSION_SECRET
  );

  return json(
    { user: { id: user.id, email: user.email, name: user.name } },
    200,
    { "Set-Cookie": `session=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${TOKEN_TTL_SECONDS}` }
  );
}

async function handleMe(request, env) {
  const token = getCookie(request, "session");
  const payload = await verifyToken(token, env.SESSION_SECRET);
  if (!payload) return json({ error: "Not authenticated" }, 401);

  const user = await env.DB.prepare("SELECT id, email, name FROM users WHERE id = ?")
    .bind(payload.sub)
    .first();
  if (!user) return json({ error: "Not authenticated" }, 401);

  return json({ user });
}
