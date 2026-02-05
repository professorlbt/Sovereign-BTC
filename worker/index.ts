import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// KV namespace bindings and secrets provided by Cloudflare Pages / Workers environment
declare const USERS_KV: KVNamespace;
declare const JWT_SECRET: string;
declare const ADMIN_EMAIL: string;
declare const ADMIN_PASSWORD_HASH: string;

type StoredUser = {
  email: string;
  password: string; // hashed
  name?: string;
  type: 'Simple' | 'Premium' | 'Root';
  status: 'Accepted' | 'Pending' | 'Simple' | 'Unknown';
  timestamp?: string;
};

const jsonResponse = (body: any, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};

const createToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
};

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, ''); // trim trailing slash
    const method = request.method.toUpperCase();

    try {
      if (path === '/register-simple' && method === 'POST') {
        const data = await request.json();
        const { email, password } = data || {};
        if (!email || !password) return jsonResponse({ success: false, error: 'Missing fields' }, 400);

        const exists = await USERS_KV.get(email);
        if (exists) return jsonResponse({ success: false, error: 'User already exists' }, 409);

        const hash = await bcrypt.hash(password, 10);
        const user: StoredUser = { email, password: hash, type: 'Simple', status: 'Accepted', timestamp: new Date().toISOString() };
        await USERS_KV.put(email, JSON.stringify(user));

        const token = createToken({ email, type: 'Simple' });
        return jsonResponse({ success: true, token });
      }

      if (path === '/register-premium' && method === 'POST') {
        const data = await request.json();
        const { email, password, fullName, protocolAgreement } = data || {};
        if (!email || !password || !fullName) return jsonResponse({ success: false, error: 'Missing fields' }, 400);
        if (!protocolAgreement) return jsonResponse({ success: false, error: 'Protocol not agreed' }, 400);

        const exists = await USERS_KV.get(email);
        if (exists) return jsonResponse({ success: false, error: 'User already exists' }, 409);

        const hash = await bcrypt.hash(password, 10);
        const user: StoredUser = { email, password: hash, name: fullName, type: 'Premium', status: 'Pending', timestamp: new Date().toISOString() };
        await USERS_KV.put(email, JSON.stringify(user));

        return jsonResponse({ success: true, status: 'Pending' });
      }

      if (path === '/login' && method === 'POST') {
        const { email, password } = await request.json();
        if (!email || !password) return jsonResponse({ success: false, error: 'Missing credentials' }, 400);

        // Admin backed by secret hash
        if (ADMIN_EMAIL && email === ADMIN_EMAIL) {
          const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
          if (match) {
            const token = createToken({ email, type: 'Root' });
            return jsonResponse({ success: true, token, type: 'Root' });
          }
        }

        const raw = await USERS_KV.get(email);
        if (!raw) return jsonResponse({ success: false, error: 'Invalid credentials' }, 401);

        const user: StoredUser = JSON.parse(raw);
        const match = await bcrypt.compare(password, user.password);
        if (!match) return jsonResponse({ success: false, error: 'Invalid credentials' }, 401);

        const token = createToken({ email, type: user.type });
        return jsonResponse({ success: true, token, status: user.status });
      }

      if (path === '/user-status' && method === 'GET') {
        const auth = request.headers.get('Authorization') || '';
        const token = auth.replace(/^Bearer\s+/i, '');
        if (!token) return jsonResponse({ success: false, error: 'Missing token' }, 401);

        try {
          const payload: any = jwt.verify(token, JWT_SECRET);
          const raw = await USERS_KV.get(payload.email);
          const user: StoredUser | null = raw ? JSON.parse(raw) : null;
          return jsonResponse({ success: true, type: payload.type, status: user?.status || 'Unknown' });
        } catch (err) {
          return jsonResponse({ success: false, error: 'Invalid token' }, 401);
        }
      }

      // Admin-only: approve premium registration
      if (path === '/approve-user' && method === 'POST') {
        const auth = request.headers.get('Authorization') || '';
        const token = auth.replace(/^Bearer\s+/i, '');
        if (!token) return jsonResponse({ success: false, error: 'Missing token' }, 401);

        try {
          const payload: any = jwt.verify(token, JWT_SECRET);
          if (payload.email !== ADMIN_EMAIL) return jsonResponse({ success: false, error: 'Not authorized' }, 403);

          const { email } = await request.json();
          const raw = await USERS_KV.get(email);
          if (!raw) return jsonResponse({ success: false, error: 'User not found' }, 404);

          const user: StoredUser = JSON.parse(raw);
          user.status = 'Accepted';
          await USERS_KV.put(email, JSON.stringify(user));
          return jsonResponse({ success: true, status: 'Accepted' });
        } catch (err) {
          return jsonResponse({ success: false, error: 'Invalid token' }, 401);
        }
      }

      // Simple health endpoint
      if (path === '/whoami' && method === 'GET') {
        const auth = request.headers.get('Authorization') || '';
        const token = auth.replace(/^Bearer\s+/i, '');
        if (!token) return jsonResponse({ success: false, error: 'Missing token' }, 401);
        try {
          const payload: any = jwt.verify(token, JWT_SECRET);
          return jsonResponse({ success: true, payload });
        } catch (err) {
          return jsonResponse({ success: false, error: 'Invalid token' }, 401);
        }
      }

      return new Response('Not found', { status: 404 });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err?.message || String(err) }, 500);
    }
  }
};
