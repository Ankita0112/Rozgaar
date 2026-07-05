# Rozgaar Clone — Setup Guide

This is a full clone of the Rozgaar blue-collar job platform: a React frontend
and a Node/Express + MongoDB backend. Original project:
https://github.com/Manvityagi/Rozgaar-Blue-Collars-Job-Seach-Platform-*

## What's inside

```
rozgaar-clone/
├── backend/     Node.js + Express + MongoDB API
└── frontend/    React app (Create React App)
```

**Note on `node_modules`:** these aren't included in the download (they're huge
and machine-specific). You'll install them yourself with `npm install` —
that's normal for any Node project.

**Important fix already applied:** the original frontend called a live demo
backend hosted on Heroku (`pacific-taiga-02637.herokuapp.com`), which is likely
no longer running. I rewired all API calls through a single `src/config.js`
file so the frontend now talks to *your own* local backend by default.

---

## 1. Backend setup

### Requirements
- Node.js (v14–16 works best with this stack's older dependencies)
- A MongoDB database — easiest is a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- (Optional, only needed for SMS/email features) Twilio account + Gmail account

### Steps
```bash
cd backend
npm install
cp .env.example .env
```

Now edit `.env` and fill in your own values:

```
db_user=...          # MongoDB Atlas username
db_pwd=...            # MongoDB Atlas password
db_host=...           # e.g. cluster0.xxxxx.mongodb.net
db_name=rozgaar

admin_mail=...         # Gmail address used to send notification emails
admin_mail_pass=...    # Gmail "app password" (not your normal password)
admin_phone=...
admin_pin=1234

twilio_sid=...          # only needed if you want SMS notifications to work
twilio_auth_token=...
```

You can leave the Twilio/mail fields blank while developing — job
posting/browsing will still work; only the notification features will fail
silently or error out.

Start the server:
```bash
npm start
```
This runs on **http://localhost:3030** by default (see `PORT` in `.env`).

---

## 2. Frontend setup

```bash
cd frontend
npm install
npm start
```
This runs on **http://localhost:3600** (configured in `package.json`) and
will automatically call your local backend at `http://localhost:3030`.

If you ever deploy the backend elsewhere, set an environment variable before
building the frontend:
```bash
REACT_APP_API_BASE_URL=https://your-deployed-backend.com npm run build
```

---

## 3. How the app is structured (for learning)

**Frontend (`frontend/src/`)**
- `App.js` — all routes (home, register, per-category job listing/candidate
  pages, post-a-job, apply-to-job), plus experimental voice-navigation via
  `react-speech-recognition`
- `Components/HomePage` — landing page sections
- `Components/UserProfile` — worker registration form
- `Components/PostOpportunity` — recruiter job-posting form
- `Components/ViewOpportunity` — job listing pages (`/jobs/:category`)
- `Components/ViewCandidates` — candidate browsing pages (`/candidates/:category`)
- `Components/ApplyJob` — apply-to-a-job form
- `i18n.js` + `Components/LanguageSelector` — multi-language support (i18next)
- `config.js` — **new file I added** to centralize the backend URL

**Backend (`backend/`)**, layered architecture:
- `routes/` — Express route definitions (`/jobs`, `/user`)
- `controllers/` — request/response handling
- `managers/` — business logic
- `services/` — data-access layer talking to MongoDB
- `models/` — Mongoose schemas (`job.js`, `user.js`)
- `commons/` — shared utilities: `mail.js` (NodeMailer), `sms.js` (Twilio),
  `util.js`

---

## 4. Suggested learning path

1. Get the backend running and hit it with Postman/curl (`GET /jobs?CATEGORY=ELECTRICIAN`)
   to understand the data shape before touching the UI.
2. Get the frontend running and connect it — try the "Post a Job" flow,
   then view it back on the "View Opportunities" page.
3. Once it works end-to-end, start intentionally changing things: rename a
   route, tweak the schema, add a new job category, adjust styling in
   `src/CSS/`, etc. Breaking and fixing things is the fastest way to actually
   learn this codebase rather than just copy it.

## 5. Known quirks in the original code (worth knowing about)

- Uses React 16 + react-router-dom v5 + react-scripts 3.4 — noticeably older
  versions than current React tooling. If you want to modernize as a learning
  exercise, upgrading these is a good next project after you have it running.
- `App.js` calls `SpeechRecognition.browserSupportsSpeechRecognition()` and
  returns `null` for the *entire app* if the browser doesn't support it —
  so if the page renders blank, check the browser console; try Chrome.
