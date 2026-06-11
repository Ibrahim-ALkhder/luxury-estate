import type { Request, Response, NextFunction } from 'express';
import { getDb } from '../db.js';

// In-memory token store: token -> userId
const tokenStore = new Map<string, string>();

export function createToken(userId: string): string {
  const token = crypto.randomUUID();
  tokenStore.set(token, userId);
  return token;
}

export function revokeToken(token: string) {
  tokenStore.delete(token);
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  const userId = tokenStore.get(token);
  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(userId) as any;
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  (req as any).user = user;
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden: insufficient permissions' });
      return;
    }
    next();
  };
}
