// api/data/index.js — User data storage (JSON-based)
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

  const userId = decoded.userId;

  try {
    if (req.method === 'POST') {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: 'key required' });
      db.updateOne('userdata', { userId, key }, { $set: { userId, key, value, updatedAt: new Date().toISOString() } }, { upsert: true });

      if (key === 'last_location' && value?.lat) {
        db.updateOne('user_locations', { userId }, {
          $set: { userId, email: decoded.email, lat: value.lat, lng: value.lng, ts: value.ts || new Date().toISOString() }
        }, { upsert: true });
      }
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'GET') {
      const key = req.query?.key;
      if (key) {
        const doc = db.findOne('userdata', { userId, key });
        return res.status(200).json({ value: doc?.value ?? null });
      }
      const docs = db.find('userdata', { userId });
      const result = {};
      docs.forEach(d => { result[d.key] = d.value; });
      return res.status(200).json(result);
    }

    if (req.method === 'DELETE') {
      const key = req.query?.key;
      if (!key) return res.status(400).json({ error: 'key required' });
      db.deleteOne('userdata', { userId, key });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
