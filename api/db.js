// api/db.js — JSON File-based Database Engine (replaces MongoDB)
// All data stored as JSON files in /db/ directory
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '..', 'db');

// Ensure db directory and subdirs exist
const COLLECTIONS = ['users', 'userdata', 'notifications', 'activity', 'user_locations', 'settings', 'user_files'];
for (const col of COLLECTIONS) {
  fs.mkdirSync(path.join(DB_DIR, col), { recursive: true });
}

// Generate unique IDs
export function newId() {
  return crypto.randomBytes(12).toString('hex');
}

// Collection file path
function colFile(collection, id) {
  return path.join(DB_DIR, collection, `${id}.json`);
}

// Index file (all docs in collection as array of IDs)
function indexFile(collection) {
  return path.join(DB_DIR, collection, '_index.json');
}

function readIndex(collection) {
  const f = indexFile(collection);
  if (!fs.existsSync(f)) return [];
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return []; }
}

function writeIndex(collection, ids) {
  fs.writeFileSync(indexFile(collection), JSON.stringify(ids, null, 2));
}

function readDoc(collection, id) {
  const f = colFile(collection, id);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; }
}

function writeDoc(collection, id, doc) {
  doc._id = id;
  fs.writeFileSync(colFile(collection, id), JSON.stringify(doc, null, 2));
}

function deleteDoc(collection, id) {
  const f = colFile(collection, id);
  if (fs.existsSync(f)) fs.unlinkSync(f);
}

// ── Collection API ──────────────────────────────────────────────
export const db = {
  // Insert one document, returns doc with _id
  insertOne(collection, doc) {
    const id = doc._id || newId();
    const newDoc = { ...doc, _id: id };
    writeDoc(collection, id, newDoc);
    const ids = readIndex(collection);
    if (!ids.includes(id)) ids.push(id);
    writeIndex(collection, ids);
    return newDoc;
  },

  // Find one by query object (simple equality match)
  findOne(collection, query) {
    const ids = readIndex(collection);
    for (const id of ids) {
      const doc = readDoc(collection, id);
      if (!doc) continue;
      if (matches(doc, query)) return doc;
    }
    return null;
  },

  // Find all matching docs
  find(collection, query = {}, options = {}) {
    const ids = readIndex(collection);
    let results = [];
    for (const id of ids) {
      const doc = readDoc(collection, id);
      if (doc && matches(doc, query)) results.push(doc);
    }
    // Sort
    if (options.sort) {
      const [field, dir] = Object.entries(options.sort)[0];
      results.sort((a, b) => {
        const av = a[field], bv = b[field];
        if (av < bv) return dir === 1 ? -1 : 1;
        if (av > bv) return dir === 1 ? 1 : -1;
        return 0;
      });
    }
    if (options.limit) results = results.slice(0, options.limit);
    return results;
  },

  // Count documents matching query
  countDocuments(collection, query = {}) {
    return this.find(collection, query).length;
  },

  // Update one matching document
  updateOne(collection, query, update, options = {}) {
    let doc = this.findOne(collection, query);
    if (!doc) {
      if (options.upsert) {
        const newDoc = { ...query };
        if (update.$set) Object.assign(newDoc, update.$set);
        return this.insertOne(collection, newDoc);
      }
      return null;
    }
    if (update.$set) Object.assign(doc, update.$set);
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) {
        doc[k] = (doc[k] || 0) + v;
      }
    }
    writeDoc(collection, doc._id, doc);
    return doc;
  },

  // Update many
  updateMany(collection, query, update) {
    const ids = readIndex(collection);
    for (const id of ids) {
      const doc = readDoc(collection, id);
      if (doc && matches(doc, query)) {
        if (update.$set) Object.assign(doc, update.$set);
        writeDoc(collection, id, doc);
      }
    }
  },

  // Delete one
  deleteOne(collection, query) {
    const doc = this.findOne(collection, query);
    if (!doc) return false;
    deleteDoc(collection, doc._id);
    const ids = readIndex(collection).filter(id => id !== doc._id);
    writeIndex(collection, ids);
    return true;
  },

  // Delete many
  deleteMany(collection, query) {
    const ids = readIndex(collection);
    const keep = [];
    for (const id of ids) {
      const doc = readDoc(collection, id);
      if (doc && matches(doc, query)) {
        deleteDoc(collection, id);
      } else {
        keep.push(id);
      }
    }
    writeIndex(collection, keep);
  },

  // Get settings (key-value store in a single JSON file)
  getSetting(key) {
    const f = path.join(DB_DIR, 'settings', `${key}.json`);
    if (!fs.existsSync(f)) return null;
    try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; }
  },

  setSetting(key, data) {
    const f = path.join(DB_DIR, 'settings', `${key}.json`);
    fs.writeFileSync(f, JSON.stringify({ key, data, updatedAt: new Date().toISOString() }, null, 2));
  },
};

// Simple query matching (supports $gte, $or)
function matches(doc, query) {
  for (const [k, v] of Object.entries(query)) {
    if (k === '$or') {
      if (!v.some(sub => matches(doc, sub))) return false;
      continue;
    }
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const [op, val] of Object.entries(v)) {
        if (op === '$gte' && !(new Date(doc[k]) >= new Date(val))) return false;
        if (op === '$lt'  && !(new Date(doc[k]) <  new Date(val))) return false;
        if (op === '$ne'  && !(doc[k] !== val)) return false;
      }
    } else {
      if (doc[k] !== v) return false;
    }
  }
  return true;
}

export default db;
