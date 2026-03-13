// api/auth/login.js — POST /api/auth/login
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'savah-dev-secret-change-in-prod';
const ADMIN_EMAIL = 'njugunaboniface211@gmail.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    let user = db.findOne('users', { email: email.toLowerCase() });

    // First-time admin setup: if admin account has placeholder password, auto-hash it
    if (user && user.password === '__SETUP_REQUIRED__' && email.toLowerCase() === ADMIN_EMAIL) {
      const hash = await bcrypt.hash(password, 12);
      db.updateOne('users', { _id: user._id }, { $set: { password: hash } });
      user = db.findOne('users', { _id: user._id });
    }

    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    if (user.provider && user.provider !== 'local') {
      return res.status(401).json({ error: `This account uses ${user.provider} sign-in` });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    db.updateOne('users', { _id: user._id }, { $set: { lastSeen: new Date().toISOString() } });

    const { password: _, ...safeUser } = user;
    safeUser.isAdmin = safeUser.isAdmin || safeUser.email === ADMIN_EMAIL;

    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: safeUser.isAdmin },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    db.insertOne('activity', {
      type: 'login',
      userId: user._id,
      email: user.email,
      ip: req.headers['x-forwarded-for'] || 'unknown',
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
