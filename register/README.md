# Discovery Convoy — Login/Signup

Cloudflare Worker + D1 backend, React frontend. No third-party auth service, full control.

## 1. Create the D1 database

```bash
wrangler d1 create discovery_convoy_auth
```

Copy the `database_id` it prints into `worker/wrangler.toml`.

## 2. Apply schema

```bash
cd worker
wrangler d1 execute discovery_convoy_auth --file=./schema.sql --remote
```

## 3. Set the session secret

```bash
wrangler secret put SESSION_SECRET
# paste any long random string when prompted
```

## 4. Deploy the worker

```bash
wrangler deploy
```

Note the deployed URL (e.g. `https://discovery-convoy-auth.yoursubdomain.workers.dev`).

## 5. Wire up React

In `react/AuthForm.jsx`, set `API_BASE` to your deployed worker URL. Wrap your app:

```jsx
import { AuthProvider } from "./AuthForm";

export default function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

Drop `<AuthForm />` anywhere you want the login/signup UI.

## Notes

- Passwords are hashed with PBKDF2 (100k iterations, SHA-256) — no external deps.
- Sessions are HMAC-signed tokens in an httpOnly cookie, 7-day expiry.
- CORS is wide open (`*`) in the worker — tighten `Access-Control-Allow-Origin` to your actual frontend domain before going live.
- If your frontend is on a different domain than the worker, `credentials: "include"` + `SameSite=None; Secure` is required (already set).
