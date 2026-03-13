/* ================================================================
   SavahLifestyle v6 — Core App Script (Fixed)
   - Theme toggle: properly working, no white flash
   - Admin access: only via specific credentials
   - JSON file-based storage (no MongoDB)
   ================================================================ */

/* Apply theme IMMEDIATELY before any rendering (prevents flash) */
(function() {
  const t = localStorage.getItem('sl:theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
})();

/* ── API Client ── */
const API = {
  base: '/api',
  async req(method, path, body) {
    const token = localStorage.getItem('sl:token');
    const opts = {
      method,
      headers: { 'Content-Type':'application/json', ...(token ? { Authorization:`Bearer ${token}` } : {}) },
      ...(body ? { body:JSON.stringify(body) } : {})
    };
    try {
      const r = await fetch(this.base + path, opts);
      const data = await r.json();
      if (!r.ok) return { error: data.error || 'Request failed' };
      return data;
    } catch (e) { return { error:'Network error' }; }
  },
  get:    (path)       => API.req('GET',    path),
  post:   (path, body) => API.req('POST',   path, body),
  put:    (path, body) => API.req('PUT',    path, body),
  delete: (path)       => API.req('DELETE', path),
  // Auth — use LocalAuth (fully offline, no server needed)
  register: (name, email, password) => {
    if (typeof LocalAuth !== 'undefined') return LocalAuth.register(name, email, password);
    return API.post('/auth/register', { name, email, password });
  },
  login: (email, password) => {
    if (typeof LocalAuth !== 'undefined') return LocalAuth.login(email, password);
    return API.post('/auth/login', { email, password });
  },
  me: () => {
    const u = Auth.getUser();
    return u ? Promise.resolve({ user: u }) : Promise.resolve({ error: 'Not logged in' });
  },
  // Data
  saveData:    (key,value)           => API.post('/data',           {key,value}),
  loadData:    (key)                 => API.get(`/data?key=${encodeURIComponent(key)}`),
  deleteData:  (key)                 => API.delete(`/data?key=${encodeURIComponent(key)}`),
  // Notifications
  getNotifs:   ()                    => API.get('/notifications'),
  markRead:    (id)                  => API.put(`/notifications/${id}`, {read:true}),
  markAllRead: ()                    => API.put('/notifications/read-all', {}),
  // Files
  getFiles:    ()                    => API.get('/files'),
  getAllFiles:  ()                    => API.get('/files?all=true'),
  uploadFile:  (name,content,type,mimeType) => API.post('/files', {name,content,type,mimeType}),
  getFile:     (id)                  => API.get(`/files/${id}`),
  deleteFile:  (id)                  => API.delete(`/files/${id}`),
  // Admin
  adminUsers:     ()           => API.get('/admin/users'),
  adminStats:     ()           => API.get('/admin/stats'),
  adminDelete:    (uid)        => API.delete(`/admin/users/${uid}`),
  adminApiKeys:   ()           => API.get('/admin/apikeys'),
  adminSaveKey:   (k,v)        => API.post('/admin/apikeys', {key:k,value:v}),
  adminActivity:  ()           => API.get('/admin/activity'),
  adminLocations: ()           => API.get('/admin/locations'),
  adminBroadcast: (msg,type)   => API.post('/admin/broadcast', {message:msg,type}),
  adminToggleFeature: (id,enabled) => API.post('/admin/features', {id,enabled}),
};

/* ── Auth ── */
const Auth = {
  ADMIN_EMAIL: 'njugunaboniface211@gmail.com',
  getUser()    { try { return JSON.parse(localStorage.getItem('sl:user')); } catch { return null; } },
  getToken()   { return localStorage.getItem('sl:token'); },
  isLoggedIn() { return !!(this.getToken() && this.getUser()); },
  isAdmin()    { const u = this.getUser(); return u?.isAdmin || u?.email === this.ADMIN_EMAIL; },
  setSession(user, token) {
    localStorage.setItem('sl:user',  JSON.stringify(user));
    localStorage.setItem('sl:token', token);
  },
  clearSession() {
    localStorage.removeItem('sl:user');
    localStorage.removeItem('sl:token');
  },
  logout() { this.clearSession(); window.location.href = 'login.html'; },
  requireAuth()  { if (!this.isLoggedIn()) { window.location.href = 'login.html'; return false; } return true; },
  requireAdmin() { if (!this.isAdmin())    { window.location.href = 'index.html';  return false; } return true; }
};

/* ── Toast ── */
const Toast = {
  container: null,
  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },
  show(message, type='success', duration=3500) {
    this.init();
    const icons = {
      success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
      error:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      info:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    };
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span class="toast-icon">${icons[type]||icons.info}</span><span>${message}</span>`;
    this.container.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => { t.classList.add('show'); }); });
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, duration);
  }
};

/* ── Theme — FIXED: proper toggle with event binding ── */
const Theme = {
  _initialized: false,
  init() {
    if (this._initialized) return;
    this._initialized = true;
    const saved = localStorage.getItem('sl:theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateToggle(saved);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sl:theme', next);
    this.updateToggle(next);
    // Restart canvas for new color scheme
    if (typeof window._bgStop === 'function') window._bgStop();
    setTimeout(() => { if (typeof initBgCanvas === 'function') initBgCanvas(); }, 50);
  },
  updateToggle(theme) {
    document.querySelectorAll('#theme-toggle, [id^="theme-toggle"]').forEach(btn => {
      btn.innerHTML = theme === 'dark'
        ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
};

/* ── Animated Background ── */
function initBgCanvas() {
  let canvas = document.getElementById('bg-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  const ctx = canvas.getContext('2d');
  let running = true;
  window._bgStop = () => { running = false; };

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initDroplets();
  };

  let droplets = [];
  const COL = 22;

  function initDroplets() {
    const W = canvas.width, H = canvas.height;
    const cols = Math.floor(W / COL);
    droplets = [];
    for (let i = 0; i < cols; i++) {
      const goDown = Math.random() > 0.35;
      const speed  = 0.5 + Math.random() * 1.1;
      const len    = 4 + Math.floor(Math.random() * 8);
      droplets.push({
        x: i * COL + COL / 2,
        y: goDown ? Math.random() * H : H + Math.random() * H,
        vy: goDown ? speed : -speed,
        len, color: goDown ? '0,120,255' : '220,30,60',
        alpha: 0.45 + Math.random() * 0.35,
        r: 1.5 + Math.random() * 1.5,
        goDown,
      });
    }
  }

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(document.documentElement);

  const draw = () => {
    if (!running) { ro.disconnect(); return; }
    const W = canvas.width, H = canvas.height;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.fillStyle = isDark ? 'rgba(6,8,16,0.16)' : 'rgba(255,255,255,0.22)';
    ctx.fillRect(0, 0, W, H);
    droplets.forEach(d => {
      for (let k = 0; k < d.len; k++) {
        const ty = d.y - (d.goDown ? k : -k) * (d.r * 3.2);
        const fade = (1 - k / d.len) * d.alpha * (k === 0 ? 1 : 0.65);
        const radius = k === 0 ? d.r * 1.4 : d.r * (1 - k / (d.len * 1.5));
        if (radius <= 0) continue;
        ctx.beginPath();
        ctx.arc(d.x, ty, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.color},${Math.max(0,fade)})`;
        ctx.fill();
      }
      d.y += d.vy;
      if (d.goDown && d.y > H + d.len * d.r * 4) {
        d.y = -d.len * d.r * 4;
        d.x = Math.floor(Math.random() * Math.floor(W / COL)) * COL + COL / 2;
      } else if (!d.goDown && d.y < -d.len * d.r * 4) {
        d.y = H + d.len * d.r * 4;
        d.x = Math.floor(Math.random() * Math.floor(W / COL)) * COL + COL / 2;
      }
    });
    requestAnimationFrame(draw);
  };
  draw();
}

/* ── Notifications ── */
const Notifs = {
  items: [],
  _loaded: false,
  load() {
    try { this.items = JSON.parse(localStorage.getItem('sl:notifs') || '[]'); } catch { this.items = []; }
  },
  add(text, type='info') {
    const n = { id:Date.now(), text, type, read:false, ts:new Date().toISOString() };
    this.items.unshift(n);
    if (this.items.length > 30) this.items = this.items.slice(0,30);
    this.save(); this.render(); this.updateBadge();
  },
  save() { localStorage.setItem('sl:notifs', JSON.stringify(this.items)); },
  unread() { return this.items.filter(n => !n.read).length; },
  markAll() { this.items.forEach(n => n.read=true); this.save(); this.render(); this.updateBadge(); },
  updateBadge() {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    const c = this.unread();
    badge.textContent = c > 9 ? '9+' : (c || '');
    if (c > 0) badge.classList.add('show'); else badge.classList.remove('show');
  },
  timeAgo(ts) {
    const d = (Date.now() - new Date(ts).getTime()) / 1000;
    if (d < 60) return 'Just now';
    if (d < 3600) return `${Math.floor(d/60)}m ago`;
    if (d < 86400) return `${Math.floor(d/3600)}h ago`;
    return `${Math.floor(d/86400)}d ago`;
  },
  render() {
    const list = document.getElementById('notif-list');
    if (!list) return;
    if (!this.items.length) { list.innerHTML = `<div class="notif-empty">No notifications yet</div>`; return; }
    list.innerHTML = this.items.slice(0,20).map(n => `
      <div class="notif-item ${n.read?'':'unread'}" onclick="Notifs.markOne(${n.id})">
        <div class="notif-dot" style="background:${n.type==='success'?'var(--green)':n.type==='warning'?'var(--warning)':n.type==='error'?'var(--danger)':'var(--blue)'}"></div>
        <div><div class="notif-text">${n.text}</div><div class="notif-time">${this.timeAgo(n.ts)}</div></div>
      </div>`).join('');
  },
  markOne(id) {
    const n = this.items.find(x => x.id===id);
    if (n) { n.read=true; this.save(); this.render(); this.updateBadge(); }
  },
  init() {
    this.load();
    this.render(); this.updateBadge();
    if (Auth.isLoggedIn()) {
      API.getNotifs().then(r => {
        if (r.notifications) {
          r.notifications.forEach(n => {
            if (!this.items.find(x => x.id===n._id))
              this.items.unshift({ id:n._id, text:n.message, type:n.type||'info', read:n.read, ts:n.createdAt });
          });
          if (this.items.length > 30) this.items = this.items.slice(0, 30);
          this.save(); this.render(); this.updateBadge();
        }
      }).catch(() => {});
    }
  }
};

/* ── Location Capture ── */
function captureLocation() {
  if (!Auth.isLoggedIn() || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    API.saveData('last_location', { lat:pos.coords.latitude, lng:pos.coords.longitude, ts:new Date().toISOString() }).catch(() => {});
  }, () => {});
}

/* ── Page loader ── */
function hideLoader() {
  const el = document.getElementById('page-loader');
  if (el) setTimeout(() => el.classList.add('hidden'), 500);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  // Skip canvas + nav on auth pages
  const isAuthPage = document.querySelector('.auth-root');
  if (!isAuthPage) {
    initBgCanvas();
    captureLocation();
    setTimeout(hideLoader, 700);
  }
});

window.API = API;
window.Auth = Auth;
window.Toast = Toast;
window.Theme = Theme;
window.Notifs = Notifs;
window.hideLoader = hideLoader;
window.initBgCanvas = initBgCanvas;
