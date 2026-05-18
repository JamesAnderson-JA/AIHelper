# MT Finance AI Case Helper — Demo

A locally-run interactive demo of an AI case helper for the MT Finance Origination Management System (OMS), built around the Hartwell Properties Ltd Buy-to-Let SPV case.

## Quick start

### 1. Add your Anthropic API key

Edit `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
```

### 2. Run the backend

```bash
cd backend
node server.js
# Runs on http://localhost:3001
```

### 3. Run the frontend

```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

## What you can demo

- **Dashboard** (`/`) — case queue with summary tiles; click Hartwell Properties Ltd to open the case
- **Case page** (`/case/MTFBTL19559`) — full OMS layout with the AI helper panel on the right
  - Suggestions tab: 8 pre-baked suggestions across Outstanding / Discrepancies / Policy flags
  - Accept / reject / act on suggestions — they log to the audit trail
  - Case health tab: 4-dimension pulse (Pace, Activity, Quality, Dependencies)
  - "Ask the helper" bar: live case-aware chat via Claude
- **Upload document** button on the case page triggers a simulated extraction sequence
- **Open waits** (`/waits`) — morning queue with age chips and chase buttons
- **Policy assistant** (`/policy`) — live Q&A against the MT Finance policy corpus
- **Audit log** (`/audit`) — full history of helper actions

## Tech stack

- Frontend: React + Vite + Tailwind CSS v4
- Backend: Node + Express + Anthropic SDK
- AI: Claude claude-sonnet-4-5 (via Anthropic API)
- Data: Static JSON + localStorage persistence
