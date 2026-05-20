# AI Coding Instructions & Tech Stack

## Core Stack
* **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion, React Hook Form, Zod.
* **Backend:** Express.js, MongoDB (Mongoose).
* **Integrations:** Stripe, Cloudinary, JWT (JSON Web Tokens).

## Token & Context Rules (Cost Optimization)
* Provide concise, production-ready code. Skip lengthy explanations unless explicitly asked.
* Do not generate placeholder CSS. Use Tailwind CSS utility classes accurately.
* Assume standard imports are available; do not rewrite standard boilerplate unless requested.

## Coding Standards
* **Documentation:** Every function, controller, and hook MUST have JSDoc comments detailing params, returns, and throws.
* **Security:** NEVER modify or generate `.env` secrets. Always use `process.env`.
* **Frontend:** Max 150 lines per component. Use Client Components (`"use client"`) ONLY when interactivity or hooks are required. Prefer Server Components for data fetching and SEO.
* **Backend:** Separate concerns strictly (Routes -> Controllers -> Models/Services).