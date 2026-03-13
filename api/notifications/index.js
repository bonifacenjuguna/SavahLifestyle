// api/notifications/index.js — GET/PUT /api/notifications
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'savah-dev-secret-change-in-prod';

function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try { return jwt.verify(auth.slice(7), JWT_SECRET); }
  catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const path = req.url || '';

    if (req.method === 'GET') {
      const notifs = db.find('notifications',
        { $or: [{ userId: decoded.userId }, { broadcast: true }] },
        { sort: { createdAt: -1 }, limit: 30 }
      );
      return res.json({ notifications: notifs });
    }

    if (req.method === 'PUT') {
      if (path.includes('/read-all')) {
        db.updateMany('notifications', { userId: decoded.userId }, { $set: { read: true } });
        return res.json({ ok: true });
      }
      const id = path.split('/notifications/')[1];
      if (id && id !== 'read-all') {
        db.updateOne('notifications', { _id: id }, { $set: { read: true } });
        return res.json({ ok: true });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
