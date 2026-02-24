# Family Calendar Web

A beautiful, mobile-first React frontend for the Family Calendar API.

## Features

- 📱 **Mobile-first design** — Works great on iPhone and TV
- 🌙 **Dark theme** — Easy on the eyes, TV-friendly
- 🎮 **Gamification** — Points, streaks, badges, leaderboard
- ✨ **Smooth animations** — Powered by Framer Motion
- 🔐 **JWT authentication** — Secure login with your API
- 📝 **Full CRUD** — Add, edit, and manage all your data

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons
- React Router
- Axios

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

## Deployment

```bash
# Build
npm run build

# Serve the dist folder with any static server
npx serve dist
```

Or deploy to Vercel, Netlify, etc.

## Pages

- `/` — Dashboard with stats, quick actions, badges
- `/calendar` — Monthly calendar view
- `/tasks` — Task list with filters
- `/homework` — Homework tracking
- `/meals` — Weekly meal planner
- `/classes` — Homeschool class schedule
- `/family` — Family member management
- `/leaderboard` — Gamification & competition
