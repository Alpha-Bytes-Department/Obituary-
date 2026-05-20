# Implementation Roadmap & Technical Specifications

**Goal:** Execute this plan sequentially. Do not move to the next phase until the "Definition of Done" for the current phase is completely met and tested. Follow the strict architectural boundaries defined below to minimize token waste and prevent hallucinations.

---

## Phase 1: Project Initialization, Routing & Authentication

**Objective:** Establish the foundational folder structures, routing logic, and secure JWT-based authentication flow.

### 1.1 Folder Structure (Strict Adherence)
* **Backend (Express):**
    * `/src/controllers` (authController.js, userController.js)
    * `/src/routes` (authRoutes.js, userRoutes.js)
    * `/src/models` (User.js, Token.js)
    * `/src/middlewares` (authMiddleware.js, errorMiddleware.js)
    * `/src/utils` (jwtUtils.js, emailUtils.js)

* **Frontend (Next.js App Router):**
    * `/src/app/(public)` (/, /obituary/[id], /login, /register, /forgot-password)
    * `/src/app/(protected)/profile` (User dashboard)
    * `/src/app/(admin)/admin` (Admin dashboard)
    * `/src/components/auth` (LoginForm, RegisterForm)

### 1.2 Authentication Endpoints & Flow
also use an env example for both back end and frontend , 
set up cors properly in the backend , allow all origin for the development while production allow only permited origin
Implement standard JWT auth using `bcryptjs` and `jsonwebtoken`.
* `POST /api/auth/register`: Accepts `firstName`, `lastName`, `email`, `password`. Hashes password.
* `POST /api/auth/login`: Validates credentials.
    * **Access Token:** Short-lived (e.g., 15 mins), returned in the JSON payload, stored in frontend memory (Zustand/Context/React Query).
    * **Refresh Token:** Long-lived (e.g., 7 days), saved in the `users` database collection, and sent to the client via an `HttpOnly`, `Secure` cookie.
* `POST /api/auth/refresh`: Reads the HttpOnly cookie, validates against the DB, and issues a new Access Token.
* `POST /api/auth/forgot-password`: Generates a reset token, saves hash to DB with expiry, sends email.
* `POST /api/auth/reset-password`: Validates token from URL and updates password.

### 1.3 Definition of Done (Phase 1)
* Users can register, log in, and log out.
* Access tokens refresh silently via the HttpOnly cookie.
* Next.js middleware restricts access to `/profile` (requires user role) and `/admin` (requires admin role).

---

## Phase 2: Database Models, Core REST API & Cloudinary

**Objective:** Create exact database models, build the core CRUD endpoints, and implement cost/space-effective media handling.

### 2.1 Database Models
Create Mongoose schemas matching `DATABASE_SCHEMA.md` exactly. Enforce types, required fields, and default values. Add Mongoose indexes to `obituaries.deceasedFirstName`, `obituaries.deceasedLastName`, and `obituaries.location.city` for fast querying.

### 2.2 Core REST Endpoints (Cost-Effective Pagination)
All `GET` endpoints returning lists MUST implement `limit` and `skip` (pagination) and projection (selecting only necessary fields) to minimize database egress costs.
* `GET /api/obituaries`: Query params: `page`, `limit`, `search`, `city`, `age`. Returns basic info only (no family tree or full bio).
* `GET /api/obituaries/:id`: Returns full document.
* `POST /api/obituaries`: Protected. Creates draft.
* `GET /api/condolences/:obituaryId`: Paginated.
* `POST /api/condolences/:obituaryId`: Creates normal or candle condolence.

### 2.3 Cloudinary Integration (Space-Effective Media)
* Use `multer` for receiving files on the Express backend.
* Upload directly to Cloudinary using specific transformation parameters to save storage and bandwidth: `f_auto` (auto-format), `q_auto` (auto-quality), `c_limit`, `w_1000` (max width 1000px).
* Save the optimized returned URL to the MongoDB `images` array.

### 2.4 Definition of Done (Phase 2)
* Mongoose models are strict and indexed.
* Postman/Swagger tests confirm APIs work with pagination and field projection.
* Images uploaded via the API are resized and optimized by Cloudinary before URL is stored.

---

## Phase 3: Frontend - Discovery, Homepage & SEO

**Objective:** Build the public-facing pages prioritizing Next.js Server-Side Rendering (SSR) for SEO.

### 3.1 Homepage UI
* **Hero Search:** Client component. Use a debounced search input pushing query params to the URL (`/?city=Dhaka&name=John`).
* **Today's Featured:** Server Component. Fetch from `/api/obituaries?featured=today`. Compare current Date/Month against `dateOfDeath`.
* **All-Time Memorable:** Server Component. Fetch where `isFeatured=true`.

### 3.2 Obituary Detail Page (`/obituary/[id]`)
* Fetch data server-side so social media bots (Facebook, WhatsApp) can read meta tags for sharing previews (Open Graph tags: `og:title`, `og:image`).
* Implement the Image Slider using Framer Motion or Swiper.js.
* Render the Family Tree conditionally if data exists.
* Condolence Section: Client component allowing guests (requiring Name/Email) or logged-in users to post. Include UI toggle for "Normal Message" vs "Light a Candle".

### 3.3 Definition of Done (Phase 3)
* Homepage renders dynamically based on URL search parameters.
* Obituary pages have correct dynamic `<meta>` tags for SEO and sharing.
* Users can successfully light a candle or leave a text condolence.

---

## Phase 4: Frontend - Creation Flow & Payments

**Objective:** Build the robust, multi-step obituary creation process and handle monetization securely.

### 4.1 Multi-Step Creation Form
* Use `react-hook-form` and `zod` for client-side validation to prevent unnecessary API calls.
* **Step 1:** Basic Details & Bio.
* **Step 2:** Image Uploads (Send to backend Cloudinary endpoint).
* **Step 3:** Family Tree builder (Dynamic field array).
* **Step 4:** Payment/Token Gate.

### 4.2 Checkout Logic
* **Promo Token Flow:** User enters code. Hit `POST /api/tokens/validate`. If valid, mark obituary as `live` and token as `isUsed=true`.
* **Stripe Flow:** Hit `POST /api/payments/create-intent`. Load Stripe Elements UI. On success, backend Stripe Webhook marks obituary as `live`.

### 4.3 User Profile Dashboard
* Fetch user's obituaries. Show status badges (`Draft`, `Pending Payment`, `Live`).
* "Request Free Token" button triggers `POST /api/users/request-token`, changing `tokenStatus` to `pending`.

### 4.4 Definition of Done (Phase 4)
* Form state persists across steps without data loss.
* Obituaries go live immediately upon successful Stripe payment or valid token application.

---

## Phase 5: Admin Panel & Moderation

**Objective:** Provide administrative control over users, content, and the token economy.

### 5.1 Admin Dashboard Features
* **Obituary Management:** Table view of all obituaries. Actions: Delete, Edit, Toggle `isFeatured`.
* **Token Approvals:** Table view of users with `tokenStatus === 'pending'`.
    * Action "Approve" triggers `POST /api/admin/generate-token`, creates a record in `promo_tokens`, sets user to `approved`, and emails the user the code.
* **Condolence Moderation:** View flagged or all condolences. Toggle status to `hidden` if inappropriate.

### 5.2 Definition of Done (Phase 5)
* Only users with `role === 'admin'` can load these routes and access the admin API endpoints.
* Admin can successfully issue a token that the user can subsequently use in Phase 4.