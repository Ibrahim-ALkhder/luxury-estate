import { Router } from 'express';
import { getDb } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/favorites
router.get('/', authenticate, (req, res) => {
  const user = (req as any).user;
  const db = getDb();
  const rows = db.prepare('SELECT property_id FROM favorites WHERE user_id = ?').all(user.id) as any[];
  res.json({ favorites: rows.map((r) => r.property_id) });
});

// POST /api/favorites/toggle
router.post('/toggle', authenticate, (req, res) => {
  const user = (req as any).user;
  const { propertyId } = req.body;
  if (!propertyId) { res.status(400).json({ error: 'propertyId required' }); return; }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND property_id = ?').get(user.id, propertyId) as any;

  if (existing) {
    db.prepare('DELETE FROM favorites WHERE id = ?').run(existing.id);
    res.json({ favorited: false });
  } else {
    const id = `fav_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    db.prepare('INSERT INTO favorites (id, user_id, property_id) VALUES (?, ?, ?)').run(id, user.id, propertyId);
    res.json({ favorited: true });
  }
});

export default router;
