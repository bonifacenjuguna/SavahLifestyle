# SavahLifestyle v6 — Changes & Fixes

## What was fixed

### 1. Light Mode Toggle (FIXED)
- Theme toggle now correctly switches between dark/light mode
- No more white flash on page load
- Toggle icon updates immediately and correctly
- The event listener is properly bound after nav injection

### 2. Admin Access (SECURED)
- Admin panel link is now HIDDEN from everyone in the footer
- Admin panel link in the user dropdown is only shown when logged in as admin
- Only `njugunaboniface211@gmail.com` can access the admin panel
- Admin credentials: Email: `njugunaboniface211@gmail.com` | Password: `Bonniyohhh_2301`

### 3. Mobile Nav Overflow (FIXED)
- Sign In button and notification bell no longer get cropped on small screens
- Responsive sizing at 480px and 360px breakpoints
- Navbar items scale down gracefully on tiny screens

### 4. Storage: MongoDB → JSON Files (REPLACED)
- All MongoDB code has been removed
- Data is now stored as JSON files in `/db/` directory:
  - `/db/users/` — User accounts
  - `/db/userdata/` — Per-user app data (todos, habits, etc.)
  - `/db/notifications/` — Notifications
  - `/db/activity/` — Login/activity logs
  - `/db/user_locations/` — Location data
  - `/db/settings/` — App settings (API keys, feature flags)
  - `/db/files/` — User-uploaded file content (raw)
- `api/db.js` is the new database engine — no external dependencies needed
- Supports: insertOne, findOne, find, updateOne, updateMany, deleteOne, deleteMany

### 5. File Zone (NEW PAGE)
- Users can create, view, download, and delete their own files
- Supported file types: TXT, JSON, Markdown, Code, CSV
- Admins can toggle to view ALL users' files
- Files are stored: metadata in `/db/user_files/`, content in `/db/files/`

### 6. Meta Tags (ADDED)
- All key HTML pages now have complete meta tags:
  - charset, viewport, theme-color
  - description, keywords, author, robots
  - Open Graph (og:title, og:description, og:type, og:site_name)
  - Twitter Card
  - Apple mobile web app meta tags

## First-time setup
1. Deploy the project
2. The admin user is pre-created in `/db/users/`
3. Log in with: `njugunaboniface211@gmail.com` / `Bonniyohhh_2301`
   - On first login, the password will be auto-hashed securely
4. Other users can register normally via the Sign Up page

## File structure
```
/
├── api/
│   ├── db.js              ← JSON database engine
│   ├── auth/login.js
│   ├── auth/register.js
│   ├── auth/me.js
│   ├── data/index.js
│   ├── notifications/index.js
│   ├── files/index.js     ← NEW: file storage API
│   └── admin/index.js
├── db/                    ← JSON data files (git-ignored in prod)
│   ├── users/
│   ├── userdata/
│   ├── notifications/
│   ├── activity/
│   ├── settings/
│   ├── user_locations/
│   ├── user_files/
│   └── files/
├── js/
│   ├── app.js             ← Fixed theme, added Files API
│   └── nav.js             ← Fixed toggle, admin-only links, mobile fix
├── css/style.css          ← Added mobile overflow fixes
└── filezone.html          ← NEW: File management page
```
