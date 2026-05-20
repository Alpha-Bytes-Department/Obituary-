# Backend — Memorials & Obituaries Platform

Tech stack (Phase 1): Node.js, Express, Mongoose (MongoDB), JWT (`jsonwebtoken`), `bcryptjs` for passwords.

Quick setup:

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in development:

```bash
npm run dev
```

Notes:

- Do NOT commit real secrets. Use `.env` locally and add it to `.gitignore`.
- Phase 1 will add auth controllers, routes, and basic middleware.
