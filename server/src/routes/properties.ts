import { Router } from 'express';
import { getDb } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

function formatProperty(row: any) {
  return {
    id: row.id,
    title: { en: row.title_en, ar: row.title_ar },
    description: row.description_en || row.description_ar
      ? { en: row.description_en, ar: row.description_ar }
      : undefined,
    price: row.price,
    location: { en: row.location_en, ar: row.location_ar },
    image: row.image,
    type: row.type,
    status: row.status,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    features: {
      en: row.features_en ? row.features_en.split(',').map((s: string) => s.trim()) : [],
      ar: row.features_ar ? row.features_ar.split(',').map((s: string) => s.trim()) : [],
    },
    floor: row.floor || undefined,
    occupancy: row.occupancy || undefined,
    measurements: row.measurements ? row.measurements.split(',').map((s: string) => s.trim()) : [],
    soundInsulation: row.sound_insulation || undefined,
    daylightFactor: row.daylight_factor || undefined,
    ceilingHeight: row.ceiling_height || undefined,
    floorPlanImage: row.floor_plan_image || undefined,
    hasAdvanced: !!row.has_advanced,
    createdAt: row.created_at,
  };
}

// GET /api/properties
router.get('/', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM properties ORDER BY created_at DESC').all();
  res.json({ properties: rows.map(formatProperty) });
});

// GET /api/properties/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id) as any;
  if (!row) { res.status(404).json({ error: 'Property not found' }); return; }
  res.json({ property: formatProperty(row) });
});

// POST /api/properties (admin only)
router.post('/', authenticate, requireRole('admin'), (req, res) => {
  const db = getDb();
  const p = req.body;
  const id = p.id || `prop_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  db.prepare(`
    INSERT INTO properties (id, title_en, title_ar, description_en, description_ar, price, location_en, location_ar,
      image, type, status, bedrooms, bathrooms, area, features_en, features_ar, floor, occupancy,
      measurements, sound_insulation, daylight_factor, ceiling_height, floor_plan_image, has_advanced)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    id, p.title?.en || '', p.title?.ar || '',
    p.description?.en || '', p.description?.ar || '',
    p.price || 0, p.location?.en || '', p.location?.ar || '',
    p.image || '', p.type || 'Villa', p.status || 'available',
    p.bedrooms || 0, p.bathrooms || 0, p.area || 0,
    p.features?.en?.join(', ') || '', p.features?.ar?.join(', ') || '',
    p.floor ?? null, p.occupancy ?? null,
    p.measurements?.join(', ') || '', p.soundInsulation || '',
    p.daylightFactor || '', p.ceilingHeight || '',
    p.floorPlanImage || '', p.hasAdvanced ? 1 : 0
  );
  const row = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;
  res.status(201).json({ property: formatProperty(row) });
});

// PUT /api/properties/:id (admin only)
router.put('/:id', authenticate, requireRole('admin'), (req, res) => {
  const db = getDb();
  const p = req.body;
  const existing = db.prepare('SELECT id FROM properties WHERE id = ?').get(req.params.id);
  if (!existing) { res.status(404).json({ error: 'Property not found' }); return; }
  db.prepare(`
    UPDATE properties SET title_en=?, title_ar=?, description_en=?, description_ar=?,
      price=?, location_en=?, location_ar=?, image=?, type=?, status=?,
      bedrooms=?, bathrooms=?, area=?, features_en=?, features_ar=?,
      floor=?, occupancy=?, measurements=?, sound_insulation=?,
      daylight_factor=?, ceiling_height=?, floor_plan_image=?, has_advanced=?
    WHERE id=?
  `).run(
    p.title?.en || '', p.title?.ar || '',
    p.description?.en || '', p.description?.ar || '',
    p.price || 0, p.location?.en || '', p.location?.ar || '',
    p.image || '', p.type || 'Villa', p.status || 'available',
    p.bedrooms || 0, p.bathrooms || 0, p.area || 0,
    p.features?.en?.join(', ') || '', p.features?.ar?.join(', ') || '',
    p.floor ?? null, p.occupancy ?? null,
    p.measurements?.join(', ') || '', p.soundInsulation || '',
    p.daylightFactor || '', p.ceilingHeight || '',
    p.floorPlanImage || '', p.hasAdvanced ? 1 : 0,
    req.params.id
  );
  const row = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id) as any;
  res.json({ property: formatProperty(row) });
});

// DELETE /api/properties/:id (admin only)
router.delete('/:id', authenticate, requireRole('admin'), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM properties WHERE id = ?').get(req.params.id);
  if (!existing) { res.status(404).json({ error: 'Property not found' }); return; }
  db.prepare('DELETE FROM properties WHERE id = ?').run(req.params.id);
  db.prepare('DELETE FROM favorites WHERE property_id = ?').run(req.params.id);
  db.prepare('DELETE FROM bookings WHERE property_id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
