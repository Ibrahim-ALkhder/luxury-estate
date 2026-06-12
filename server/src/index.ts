import express from 'express';
import cors from 'cors';
import { getDb, closeDb } from './db.js';
import { createTables } from './schema.js';
import { seed } from './seed.js';
import { authenticate, requireRole } from './middleware/auth.js';
import { cleanup } from './cleanup.js';
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import favoriteRoutes from './routes/favorites.js';
import leadRoutes from './routes/leads.js';
import bookingRoutes from './routes/bookings.js';
import messageRoutes from './routes/messages.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://luxury-estate-web.onrender.com',
    'https://luxury-estate-client.onrender.com',
    'https://luxury-estate-app.onrender.com',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Initialize database
createTables();
seed();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', db: 'sqlite' });
});

// Admin: wipe transactional client data
app.post('/api/admin/cleanup', authenticate, requireRole('admin'), (_req, res) => {
  cleanup();
  res.json({ success: true, message: 'All transactional data cleared. Admin account preserved.' });
});

app.listen(PORT, () => {
  console.log(`LUXESTATE API running on http://localhost:${PORT}`);
  console.log(`Database: SQLite (${getDb().name})`);
});

process.on('SIGINT', () => { closeDb(); process.exit(0); });
process.on('SIGTERM', () => { closeDb(); process.exit(0); });
