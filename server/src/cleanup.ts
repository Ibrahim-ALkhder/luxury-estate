import { getDb } from './db.js';

export function cleanup() {
  const db = getDb();

  const before = {
    users: (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c,
    favorites: (db.prepare('SELECT COUNT(*) as c FROM favorites').get() as any).c,
    leads: (db.prepare('SELECT COUNT(*) as c FROM leads').get() as any).c,
    bookings: (db.prepare('SELECT COUNT(*) as c FROM bookings').get() as any).c,
  };

  db.exec(`
    DELETE FROM bookings;
    DELETE FROM favorites;
    DELETE FROM leads;
    DELETE FROM users WHERE role != 'admin';
  `);

  const after = {
    users: (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c,
    favorites: (db.prepare('SELECT COUNT(*) as c FROM favorites').get() as any).c,
    leads: (db.prepare('SELECT COUNT(*) as c FROM leads').get() as any).c,
    bookings: (db.prepare('SELECT COUNT(*) as c FROM bookings').get() as any).c,
  };

  console.log('=== DATABASE CLEANUP COMPLETE ===');
  console.log(`Users:    ${before.users} → ${after.users} (admin only kept)`);
  console.log(`Favorites: ${before.favorites} → ${after.favorites}`);
  console.log(`Leads:     ${before.leads} → ${after.leads}`);
  console.log(`Bookings:  ${before.bookings} → ${after.bookings}`);
  console.log('================================');
}
