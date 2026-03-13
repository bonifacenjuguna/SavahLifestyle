// api/files/index.js — User file storage (JSON/text based, no external DB)
import jwt from 'jsonwebtoken';
import { db, newId } from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILES_DIR = path.join(__dirname, '..', '..', 'db', 'files');
fs.mkdirSync(FILES_DIR, { recursive: true });

const JWT_SECRET = process.env.JWT_SECRET || 'savah-dev-secret-change-in-prod';
const ADMIN_EMAIL = 'njugunaboniface211@gmail.com';

function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try { return jwt.verify(auth.slice(7), JWT_SECRET); }
  catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

  const userId = decoded.userId;
  const isAdmin = decoded.isAdmin || decoded.email === ADMIN_EMAIL;
  const urlPath = req.url || '';

  try {
    // List files — GET /api/files
    if (req.method === 'GET' && !urlPath.match(/\/files\/.+/)) {
      let files;
      if (isAdmin && req.query?.all === 'true') {
        files = db.find('user_files', {}, { sort: { createdAt: -1 } });
      } else {
        files = db.find('user_files', { userId }, { sort: { createdAt: -1 } });
      }
      // Return metadata only (not content)
      return res.json({ files: files.map(f => ({ ...f, content: undefined })) });
    }

    // Get file content — GET /api/files/:id
    if (req.method === 'GET' && urlPath.match(/\/files\/.+/)) {
      const fileId = urlPath.split('/files/')[1];
      const file = db.findOne('user_files', { _id: fileId });
      if (!file) return res.status(404).json({ error: 'File not found' });
      if (file.userId !== userId && !isAdmin) return res.status(403).json({ error: 'Access denied' });
      // Read actual content from disk
      const contentPath = path.join(FILES_DIR, `${fileId}.dat`);
      const content = fs.existsSync(contentPath) ? fs.readFileSync(contentPath, 'utf8') : '';
      return res.json({ file: { ...file, content } });
    }

    // Upload/create file — POST /api/files
    if (req.method === 'POST' && !urlPath.match(/\/files\/.+/)) {
      const { name, content, type, mimeType } = req.body;
      if (!name) return res.status(400).json({ error: 'File name required' });

      const fileId = newId();
      const size = Buffer.byteLength(content || '', 'utf8');

      // Save content to disk
      fs.writeFileSync(path.join(FILES_DIR, `${fileId}.dat`), content || '');

      // Save metadata to DB
      const meta = db.insertOne('user_files', {
        _id: fileId,
        userId,
        userEmail: decoded.email,
        name: name.trim(),
        type: type || 'text',
        mimeType: mimeType || 'text/plain',
        size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return res.status(201).json({ file: meta, ok: true });
    }

    // Delete file — DELETE /api/files/:id
    if (req.method === 'DELETE' && urlPath.match(/\/files\/.+/)) {
      const fileId = urlPath.split('/files/')[1];
      const file = db.findOne('user_files', { _id: fileId });
      if (!file) return res.status(404).json({ error: 'File not found' });
      if (file.userId !== userId && !isAdmin) return res.status(403).json({ error: 'Access denied' });

      db.deleteOne('user_files', { _id: fileId });
      const contentPath = path.join(FILES_DIR, `${fileId}.dat`);
      if (fs.existsSync(contentPath)) fs.unlinkSync(contentPath);
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Files error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
