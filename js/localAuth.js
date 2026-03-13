/* ================================================================
   SavahLifestyle — Local Auth Engine
   Fully client-side authentication using localStorage as database.
   No server, no API keys needed. Works offline.
   
   Users stored in: localStorage key "sl:db:users" (JSON array)
   Sessions:        localStorage keys "sl:user", "sl:token"
   ================================================================ */

const LocalDB = {
  /* ── Users table ── */
  getUsers() {
    try { return JSON.parse(localStorage.getItem('sl:db:users') || '[]'); } catch { return []; }
  },
  saveUsers(users) {
    localStorage.setItem('sl:db:users', JSON.stringify(users));
  },
  findUser(predicate) {
    return this.getUsers().find(predicate) || null;
  },
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },
  updateUser(id, updates) {
    const users = this.getUsers().map(u => u.id === id ? { ...u, ...updates } : u);
    this.saveUsers(users);
  },

  /* ── Simple ID generator ── */
  newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },

  /* ── Password hashing (SHA-256 via SubtleCrypto — async) ── */
  async hashPassword(password, salt) {
    const data = new TextEncoder().encode(salt + password + 'savah_v7_secret');
    const buf  = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  },

  async verifyPassword(password, storedHash, salt) {
    const hash = await this.hashPassword(password, salt);
    return hash === storedHash;
  },

  /* ── Session token (simple signed string, client-only) ── */
  makeToken(user) {
    const payload = btoa(JSON.stringify({ id: user.id, email: user.email, ts: Date.now() }));
    const sig = btoa(user.id + user.email + 'savah_token_key').slice(0, 16);
    return `savah.${payload}.${sig}`;
  },

  /* ── Seed admin account if not present ── */
  async seedAdmin() {
    const ADMIN_EMAIL = 'njugunaboniface211@gmail.com';
    const ADMIN_PASS  = 'Bonniyohhh_2301';
    const existing = this.findUser(u => u.email === ADMIN_EMAIL);
    if (existing) return; // Already exists
    const salt = 'admin_salt_' + ADMIN_EMAIL.slice(0,8);
    const hash = await this.hashPassword(ADMIN_PASS, salt);
    this.addUser({
      id:          'admin_7399adb73d16',
      name:        'Boniface Njuguna',
      email:       ADMIN_EMAIL,
      username:    'njugunaboniface211',
      password_hash: hash,
      password_salt: salt,
      isAdmin:     true,
      provider:    'local',
      bio:         '',
      avatar:      '',
      location:    '',
      website:     '',
      createdAt:   '2026-03-12T22:28:26.946Z',
      lastSeen:    new Date().toISOString(),
    });
  }
};

/* ── LocalAuth public API — mirrors API.login / API.register ── */
const LocalAuth = {
  async login(email, password) {
    if (!email || !password) return { error: 'Email and password required' };
    const user = LocalDB.findUser(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { error: 'No account found with that email' };
    if (user.provider && user.provider !== 'local') {
      return { error: `This account uses ${user.provider} sign-in` };
    }
    const valid = await LocalDB.verifyPassword(password, user.password_hash, user.password_salt);
    if (!valid) return { error: 'Incorrect password' };

    // Update lastSeen
    LocalDB.updateUser(user.id, { lastSeen: new Date().toISOString() });

    const { password_hash, password_salt, ...safeUser } = user;
    const token = LocalDB.makeToken(safeUser);
    return { user: safeUser, token };
  },

  async register(name, email, password) {
    if (!name || !email || !password) return { error: 'All fields required' };
    if (password.length < 8) return { error: 'Password must be at least 8 characters' };

    const exists = LocalDB.findUser(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { error: 'An account with this email already exists' };

    const id   = LocalDB.newId();
    const salt = 'salt_' + id;
    const hash = await LocalDB.hashPassword(password, salt);

    const newUser = {
      id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g,''),
      password_hash: hash,
      password_salt: salt,
      isAdmin: false,
      provider: 'local',
      bio: '',
      avatar: '',
      location: '',
      website: '',
      createdAt: new Date().toISOString(),
      lastSeen:  new Date().toISOString(),
    };

    LocalDB.addUser(newUser);
    const { password_hash: _, password_salt: __, ...safeUser } = newUser;
    const token = LocalDB.makeToken(safeUser);
    return { user: safeUser, token };
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = LocalDB.findUser(u => u.id === userId);
    if (!user) return { error: 'User not found' };
    const valid = await LocalDB.verifyPassword(currentPassword, user.password_hash, user.password_salt);
    if (!valid) return { error: 'Current password is incorrect' };
    const salt = 'salt_' + userId + '_' + Date.now();
    const hash = await LocalDB.hashPassword(newPassword, salt);
    LocalDB.updateUser(userId, { password_hash: hash, password_salt: salt });
    return { success: true };
  },

  updateProfile(userId, updates) {
    // Never allow updating password_hash/salt/isAdmin this way
    const { password_hash, password_salt, isAdmin, ...safe } = updates;
    LocalDB.updateUser(userId, safe);
    // Refresh session user object
    const updated = LocalDB.findUser(u => u.id === userId);
    if (updated) {
      const { password_hash: _, password_salt: __, ...safeUser } = updated;
      localStorage.setItem('sl:user', JSON.stringify(safeUser));
    }
    return { success: true };
  },

  getAllUsers() {
    return LocalDB.getUsers().map(({ password_hash, password_salt, ...u }) => u);
  },

  deleteUser(userId) {
    const users = LocalDB.getUsers().filter(u => u.id !== userId);
    LocalDB.saveUsers(users);
    return { success: true };
  }
};

// Seed admin on load
LocalDB.seedAdmin();

window.LocalDB   = LocalDB;
window.LocalAuth = LocalAuth;
