// api/admin/index.js — Admin routes (JSON-based storage)
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'savah-dev-secret-change-in-prod';
const ADMIN_EMAIL = 'njugunaboniface211@gmail.com';

function verifyAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const d = jwt.verify(auth.slice(7), JWT_SECRET);
    if (!d.isAdmin && d.email !== ADMIN_EMAIL) return null;
    return d;
  } catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const admin = verifyAdmin(req);
  if (!admin) return res.status(403).json({ error: 'Admin access required' });

  const path = req.url || '';

  try {
    // GET /api/admin/users
    if (req.method === 'GET' && path.includes('/users') && !path.match(/\/users\/.+/)) {
      const users = db.find('users', {}, { sort: { createdAt: -1 } }).map(u => {
        const { password: _, ...safe } = u;
        return safe;
      });
      return res.json({ users, total: users.length });
    }

    // DELETE /api/admin/users/:id
    if (req.method === 'DELETE' && path.match(/\/users\/.+/)) {
      const userId = path.split('/users/')[1];
      db.deleteOne('users', { _id: userId });
      db.deleteMany('userdata', { userId });
      db.deleteMany('notifications', { userId });
      return res.json({ ok: true });
    }

    // GET /api/admin/stats
    if (req.method === 'GET' && path.includes('/stats')) {
      const today = new Date(); today.setHours(0,0,0,0);
      const allUsers = db.find('users');
      const newToday = allUsers.filter(u => new Date(u.createdAt) >= today).length;
      const allActivity = db.find('activity', {}, { sort: { timestamp: -1 } });
      const loginsToday = allActivity.filter(a => a.type === 'login' && new Date(a.timestamp) >= today).length;
      const totalData = db.countDocuments('userdata');
      return res.json({
        totalUsers: allUsers.length,
        newToday,
        loginsToday,
        totalDataEntries: totalData,
        recentActivity: allActivity.slice(0, 30)
      });
    }

    // GET /api/admin/locations
    if (req.method === 'GET' && path.includes('/locations')) {
      const locs = db.find('user_locations', {}, { sort: { ts: -1 }, limit: 100 });
      return res.json({ locations: locs });
    }

    // GET/POST /api/admin/apikeys
    if (path.includes('/apikeys')) {
      if (req.method === 'GET') {
        const keys = db.getSetting('apikeys');
        return res.json({ keys: keys?.data || {} });
      }
      if (req.method === 'POST') {
        const { key, value } = req.body;
        const current = db.getSetting('apikeys') || { data: {} };
        current.data[key] = value;
        db.setSetting('apikeys', current.data);
        return res.json({ ok: true });
      }
    }

    // GET /api/admin/activity
    if (req.method === 'GET' && path.includes('/activity')) {
      const activity = db.find('activity', {}, { sort: { timestamp: -1 }, limit: 100 });
      return res.json({ activity });
    }

    // POST /api/admin/broadcast
    if (req.method === 'POST' && path.includes('/broadcast')) {
      const { message, type } = req.body;
      db.insertOne('notifications', {
        broadcast: true,
        message,
        type: type || 'info',
        read: false,
        createdAt: new Date().toISOString()
      });
      return res.json({ ok: true });
    }

    // POST /api/admin/features
    if (req.method === 'POST' && path.includes('/features')) {
      const { id, enabled } = req.body;
      const features = db.getSetting('features') || { data: {} };
      features.data[id] = enabled;
      db.setSetting('features', features.data);
      return res.json({ ok: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
