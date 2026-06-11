import { Router } from 'express';
import { getDb } from '../db.js';
import { hashPassword, verifyPassword } from '../hash.js';
import { createToken, revokeToken, authenticate } from '../middleware/auth.js';

const router = Router();

function uid(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }

  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!row || !verifyPassword(password, row.password_hash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = createToken(row.id);
  res.json({
    token,
    user: { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role, createdAt: row.created_at },
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password required' });
    return;
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const id = uid();
  const pwdHash = hashPassword(password);

  db.prepare(
    'INSERT INTO users (id, name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, name, email, phone || '', pwdHash, 'user');

  // Auto-create lead
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  db.prepare(
    'INSERT INTO leads (id, user_id, name, email, phone, source, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(leadId, id, name, email, phone || '', 'website', 'New Registered User');

  const token = createToken(id);
  res.status(201).json({
    token,
    user: { id, name, email, phone: phone || '', role: 'user', createdAt: new Date().toISOString() },
  });
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const user = (req as any).user;
  res.json({ user });
});

// PUT /api/auth/profile
router.put('/profile', authenticate, (req, res) => {
  const user = (req as any).user;
  const { name, email, phone, oldPassword, newPassword } = req.body;

  const db = getDb();

  if (oldPassword) {
    const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(user.id) as any;
    if (!row || !verifyPassword(oldPassword, row.password_hash)) {
      res.status(403).json({ error: 'Current password is incorrect' });
      return;
    }
  } else {
    res.status(400).json({ error: 'Current password required to save changes' });
    return;
  }

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const emailExists = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, user.id);
  if (emailExists) {
    res.status(409).json({ error: 'Email already in use' });
    return;
  }

  db.prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?')
    .run(name, email, phone || '', user.id);

  if (newPassword && newPassword.length >= 6) {
    const newHash = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, user.id);
  }

  // Sync to leads
  db.prepare('UPDATE leads SET name = ?, email = ?, phone = ? WHERE user_id = ?')
    .run(name, email, phone || '', user.id);

  // Sync to bookings
  db.prepare('UPDATE bookings SET user_name = ?, user_email = ?, user_phone = ? WHERE user_id = ?')
    .run(name, email, phone || '', user.id);

  const updated = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(user.id) as any;
  res.json({ user: { ...updated, createdAt: updated.created_at } });
});

// POST /api/auth/logout
router.post('/logout', authenticate, (req, res) => {
  const authHeader = req.headers.authorization!;
  const token = authHeader.slice(7);
  revokeToken(token);
  res.json({ success: true });
});

export default router;
