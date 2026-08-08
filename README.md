# SOA Ideathon TeamUp & Prep Hub — MERN (React + Express, MVC)

A full MERN stack app for SOA students to form compliant 6-member teams for SIH 2026 and
prepare together. Two independent projects, each deployed separately:

```
soa-teamup/
├── backend/    Express + MongoDB (MVC) — REST API
└── frontend/   React (Vite) + React Router + Tailwind — SPA
```

**This is a team-formation and preparation tool — not the official SIH registration system.**

## Backend structure (MVC)

```
backend/
├── server.js          # App entry point
├── config/db.js        # MongoDB connection
├── models/             # M — Mongoose schemas (User, Team, JoinRequest, ...)
├── controllers/         # C — business logic per resource
├── routes/              # Express routers wiring URLs → controllers
├── middleware/           # auth (JWT), admin guard, error handler, async wrapper
└── utils/                # validation rules, sanitization, email, jwt, seed script
```

There's no traditional "View" layer here — the API returns JSON, and the `frontend/`
React app is the view. This is the standard shape for a decoupled MERN app.

## 1. Prerequisites

- Node.js 18.17+
- A MongoDB database (the free tier on [MongoDB Atlas](https://www.mongodb.com/atlas) works well)
- A [Resend](https://resend.com) account + API key (free tier is fine) for sending OTP emails — optional for local dev, codes just log to the console if omitted

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `PORT` | Port the API runs on (default `5000`) |
| `CLIENT_ORIGIN` | Your frontend's URL, for CORS (`http://localhost:5173` locally) |
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Any long random string — generate with `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `30d` |
| `RESEND_API_KEY` | From resend.com. If omitted, OTP codes are logged to the server console instead of emailed |
| `EMAIL_FROM` | The from-address Resend sends with |
| `ADMIN_EMAILS` | Comma-separated emails that get admin access on first sign-in |

Run it:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

Optional: seed a couple of sample mentors and default prep-hub content:

```bash
npm run seed
```

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Your backend's API base URL (`http://localhost:5000/api` locally) |
| `VITE_EVENT_NAME` / `VITE_EVENT_DATE` | Fallback event details shown before an admin sets them |

Run it:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## 4. How sign-in works

There's no password. A user enters their email, receives a 6-digit code (via Resend, or
via the backend console if `RESEND_API_KEY` isn't set), and enters it to sign in.
The backend issues a JWT on successful verification; the frontend stores it in
`localStorage` and attaches it as a `Bearer` token on every API request. Codes expire
after 10 minutes; requests are rate-limited to 3 per 10 minutes per IP. The first
sign-in with an email listed in `ADMIN_EMAILS` becomes an admin automatically.

## 5. Deploying

These are two separate deployments:

**Backend** — any Node host (Render, Railway, Fly.io, an EC2 box, etc.):
1. Push `backend/` to its own repo (or deploy the subfolder directly).
2. Set the environment variables from `backend/.env.example`.
3. Set `CLIENT_ORIGIN` to your deployed frontend's URL.
4. Start command: `npm start`.
5. Make sure MongoDB Atlas network access allows your host's IP (or `0.0.0.0/0`).

**Frontend** — any static host (Vercel, Netlify, Render static sites, etc.):
1. Push `frontend/` to its own repo (or deploy the subfolder directly).
2. Set `VITE_API_URL` to your deployed backend's `/api` URL.
3. Build command: `npm run build`. Output directory: `dist`.

## 6. Hard rules enforced server-side (see `backend/utils/validation.js`)

- Max 6 members per team
- At least 1 female member required to submit
- One active team per student
- Members must share the team's college
- Team locked (no join/leave) after submission unless an admin reopens it
- Valid email format required at sign-in

All of these are re-validated on every relevant API route — never trust client-side checks alone.

## 7. Known MVP limits

No real-time chat, no video calls, no file uploads (portfolios are external links),
no automatic SIH registration integration, single-college assumption per deployment,
no push notifications (email only), and no full project-management board — just a
lightweight task list per team.
