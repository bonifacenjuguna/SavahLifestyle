# SavahLifestyle v4 — Deployment Guide

## Quick Deploy to Vercel + MongoDB Atlas

### Step 1: MongoDB Atlas
1. Go to https://mongodb.com/atlas and create a free account
2. Create a new cluster (free M0 tier is fine)
3. Create a database user: Security → Database Access → Add New User
4. Allow network access: Security → Network Access → Allow from Anywhere (0.0.0.0/0)
5. Get your connection string: Connect → Drivers → copy the URI

### Step 2: Deploy to Vercel
1. Push this project to GitHub
2. Go to https://vercel.com and import your GitHub repo
3. Add these environment variables in Vercel dashboard:
   - `MONGODB_URI` — your MongoDB connection string
   - `JWT_SECRET` — any long random string (e.g. run: `openssl rand -hex 32`)
   - `ADMIN_EMAIL` — your admin email address

### Step 3: Optional API Keys (via Admin Panel)
After deploying, go to `/admin.html` and add:
- **OpenWeatherMap** — free key from openweathermap.org (weather features)
- **Exchange Rate API** — from exchangerate-api.com (currency converter)
- **Google Client ID/Secret** — from Google Cloud Console (Google sign-in)
- **Facebook App ID/Secret** — from developers.facebook.com (Facebook sign-in)
- **Gemini API Key** — from Google AI Studio (AI features)

### Step 4: Verify
- Visit your Vercel URL
- Sign up with your admin email
- Access `/admin.html` — you should see the admin dashboard
- All users who register will appear in the Users section

## Local Development
```bash
npm install
cp .env.example .env
# Fill in .env values
npx vercel dev
```
