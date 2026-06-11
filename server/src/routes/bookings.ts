import { Router } from 'express';
import { getDb } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

function uid(): string {
  return `book_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// POST /api/bookings (authenticated user)
router.post('/', authenticate, (req, res) => {
  const user = (req as any).user;
  const { propertyId } = req.body;
  if (!propertyId) { res.status(400).json({ error: 'propertyId required' }); return; }

  const db = getDb();

  // BUSINESS RULE: Prevent booking on sold properties
  const property = db.prepare('SELECT status FROM properties WHERE id = ?').get(propertyId) as any;
  if (!property) { res.status(404).json({ error: 'Property not found' }); return; }
  if (property.status === 'sold') {
    res.status(400).json({ error: 'This property has been sold and cannot be booked.' });
    return;
  }

  const id = uid();
  db.prepare(
    'INSERT INTO bookings (id, user_id, property_id, user_name, user_email, user_phone) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, user.id, propertyId, user.name, user.email, user.phone);
  res.status(201).json({ booking: { id, userId: user.id, propertyId, userName: user.name, userEmail: user.email, userPhone: user.phone, createdAt: new Date().toISOString() } });
});

// GET /api/bookings (admin: all, user: own)
router.get('/', authenticate, (req, res) => {
  const user = (req as any).user;
  const db = getDb();
  let rows: any[];
  const sql = `
    SELECT b.*, p.title_en AS property_title_en, p.title_ar AS property_title_ar
    FROM bookings b
    LEFT JOIN properties p ON p.id = b.property_id
  `;
  if (user.role === 'admin') {
    rows = db.prepare(sql + ' ORDER BY b.created_at DESC').all();
  } else {
    rows = db.prepare(sql + ' WHERE b.user_id = ? ORDER BY b.created_at DESC').all(user.id);
  }
  const bookings = rows.map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    propertyId: r.property_id,
    userName: r.user_name,
    userEmail: r.user_email,
    userPhone: r.user_phone,
    propertyTitle: r.property_title_en || '',
    createdAt: r.created_at,
  }));
  res.json({ bookings });
});

export default router;
