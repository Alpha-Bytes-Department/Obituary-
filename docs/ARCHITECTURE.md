# System Architecture & Guidelines

## 1. Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS, Framer Motion (for sliders and UI).
* **Backend:** Express.js (Node.js REST API).
* **Database:** MongoDB (Mongoose ODM).
* **Storage:** AWS S3 or Cloudinary (for image slider assets).
* **Payment:** Stripe API.

## 2. System Architecture
The system follows a decoupled Client-Server architecture:
* **Client (Next.js):** Handles SSR/SSG for SEO optimization (crucial for obituaries). Fetches data from the Express backend.
* **API (Express.js):** RESTful endpoints handling business logic, Stripe webhooks, and database queries.
* **Database (MongoDB):** NoSQL document storage optimized for read-heavy operations (viewing obituaries).

## 3. Folder Structure
### Frontend (Next.js)
```text
/src
  /app           # Next.js App Router (pages: /, /obituary/[id], /profile, /admin)
  /components    # Reusable UI (Slider, FamilyTree, SearchBar, ObituaryCard)
  /lib           # API utility functions and Axios instances
  /hooks         # Custom React hooks

```

## 4. Folder Structure
### Backend (Express.js)
```text 
/src
  /controllers   # Route logic (auth, obituaries, tokens, admin)
  /models        # Mongoose Schemas
  /routes        # Express Router definitions
  /middlewares   # Auth verification, error handling, multer (image upload)
  ```