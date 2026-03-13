// api/auth/me.js — GET /api/auth/me
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'savah-dev-secret-change-in-prod';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    const user = db.findOne('users', { _id: decoded.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...safeUser } = user;
    return res.status(200).json({ user: safeUser });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
