import { Router } from 'express';
import { getDb } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

function uid(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// POST /api/messages — public, no auth required
router.post('/', (req, res) => {
  const { name, email, message, propertyId, propertyTitle } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }

  const db = getDb();
  const id = uid();
  db.prepare(
    'INSERT INTO messages (id, name, email, message, property_id, property_title) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, name, email, message, propertyId || null, propertyTitle || null);

  res.status(201).json({ success: true, message: 'Message sent successfully' });
});

// GET /api/messages — admin only
router.get('/', authenticate, requireRole('admin'), (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  res.json({ messages: rows });
});

// PATCH /api/messages/:id/read — mark as read (admin)
router.patch('/:id/read', authenticate, requireRole('admin'), (req, res) => {
  const db = getDb();
  db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
