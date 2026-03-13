// api/auth/register.js — POST /api/auth/register
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, newId } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'savah-dev-secret-change-in-prod';
const ADMIN_EMAIL = 'njugunaboniface211@gmail.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

  try {
    const exists = db.findOne('users', { email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    let baseUsername = email.toLowerCase().split('@')[0].replace(/[^a-z0-9_]/g, '');
    let username = baseUsername;
    let suffix = 1;
    while (db.findOne('users', { username })) {
      username = baseUsername + suffix++;
    }

    const hashed = await bcrypt.hash(password, 12);
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    const doc = db.insertOne('users', {
      name: name.trim(),
      email: email.toLowerCase(),
      username,
      password: hashed,
      isAdmin,
      provider: 'local',
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      tasksCompleted: 0,
      focusMinutes: 0,
      habitsStreak: 0,
      notesCount: 0,
      totalExpenses: 0,
    });

    const { password: _, ...safeUser } = doc;

    const token = jwt.sign(
      { userId: doc._id, email: safeUser.email, isAdmin },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    db.insertOne('activity', {
      type: 'register',
      userId: doc._id,
      email: safeUser.email,
      ip: req.headers['x-forwarded-for'] || 'unknown',
      timestamp: new Date().toISOString()
    });

    db.insertOne('notifications', {
      userId: doc._id,
      message: `Welcome to SavahLifestyle, ${username}! Your account is ready.`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
