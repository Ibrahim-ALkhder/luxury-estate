import { Router } from 'express';
import { getDb } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/leads (admin only)
router.get('/', authenticate, requireRole('admin'), (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json({ leads: rows });
});

export default router;
