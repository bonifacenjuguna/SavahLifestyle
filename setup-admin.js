#!/usr/bin/env node
// run: node setup-admin.js
// Creates the admin user with proper bcrypt password hash
// Run once after deployment

import bcrypt from 'bcryptjs';
import { db } from './api/db.js';

const ADMIN_EMAIL = 'njugunaboniface211@gmail.com';
const ADMIN_PASS  = 'Bonniyohhh_2301';

const existing = db.findOne('users', { email: ADMIN_EMAIL });
if (existing) {
  const hash = await bcrypt.hash(ADMIN_PASS, 12);
  db.updateOne('users', { email: ADMIN_EMAIL }, { $set: { password: hash, isAdmin: true } });
  console.log('✓ Admin password updated.');
} else {
  const hash = await bcrypt.hash(ADMIN_PASS, 12);
  db.insertOne('users', {
    name: 'Boniface Njuguna',
    email: ADMIN_EMAIL,
    username: 'njugunaboniface211',
    password: hash,
    isAdmin: true,
    provider: 'local',
    createdAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    tasksCompleted: 0, focusMinutes: 0, habitsStreak: 0, notesCount: 0, totalExpenses: 0
  });
  console.log('✓ Admin user created.');
}
console.log('Login: njugunaboniface211@gmail.com / Bonniyohhh_2301');
