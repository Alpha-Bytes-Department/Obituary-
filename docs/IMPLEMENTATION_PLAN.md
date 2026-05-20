# Implementation Roadmap & Technical Specifications (Segmented Approach)

**Goal:** Execute this plan sequentially. We will build the entire UI using mock data first, establish the backend infrastructure second, and finally bridge the two. Do not move to the next phase until the "Definition of Done" is met.

---

## Phase 1: Frontend Initialization & Mock UI Shell

**Objective:** Set up the Next.js project, implement routing, and build the foundational layouts using static/mock data.

### 1.1 Frontend Structure & Routing
* **API and tech:** use axios , react hook form 
* **App Router Setup:**
    * `/src/app/(public)` (/, /obituary, /obituary/[id], /login, /register, /forgot-password)
    * `/src/app/(protected)/profile` (User dashboard, create obituary)
    * `/src/app/(admin)/admin` (Admin dashboard)
* **Global Layouts:** Navbar (with dynamic links for guest/user/admin), Footer , use context api for the global context and state management.
* **Provider and hooks:** Make provider and wrapper for the required provider like axios provider by creating a hook 


### 1.2 UI Components & Mock Data
* Create a `src/lib/mockData.js` file to hold fake obituaries, users, and condolences.
* Build the **Homepage:** Hero search bar UI, Today's Featured grid, All-Time Memorable grid.
* Build the **Obituary Detail Page:** Image slider UI, Biography layout, Family Tree visualizer, and Condolences section.
* Build **Auth Forms:** Login, Register, Forgot Password UI using `react-hook-form` and `zod` for validation.

### 1.3 Definition of Done (Phase 1)
* All routes are accessible and render without errors.
* The application looks complete visually using mock data.
* Client-side form validation works perfectly.

---

## Phase 2: Frontend State & Complex Flows

**Objective:** Implement frontend state management and build out the complex user interaction flows.

### 2.1 Multi-Step Obituary Creation Form (`/profile/create`)
* **Step 1:** Basic Details & Bio form.
* **Step 2:** Image Uploads UI (simulate upload delay).
* **Step 3:** Family Tree builder (Dynamic field array allowing add/remove relations).
* **Step 4:** Payment/Token Gate UI (mock Stripe elements and token input).

### 2.2 Dashboards
* **User Profile:** UI for viewing personal mock obituaries with status badges (Draft, Pending Payment, Live) and the "Request Token" button.
* **Admin Panel:** Data tables for Obituary Management, Token Approvals, and Condolence Moderation using mock data.

### 2.3 Definition of Done (Phase 2)
* The multi-step form persists state across steps.
* Admin and User dashboards accurately reflect state changes (e.g., clicking "approve" updates the mock UI).

---

## Phase 3: Backend Initialization, Database & Core API

**Objective:** Set up Express.js, connect to MongoDB, and build the strict data models.

### 3.1 Backend Structure & Setup
* Establish `/src/controllers`, `/src/routes`, `/src/models`, `/src/middlewares`, `/src/utils`.
* Setup CORS to allow all origins for development and restricted origins for production.
* Create `.env.example` defining required keys.

### 3.2 Database Models
* Implement Mongoose schemas exactly as defined in `DATABASE_SCHEMA.md`.
* Add Mongoose indexes to `deceasedFirstName`, `deceasedLastName`, and `location.city`.

### 3.3 Core REST Endpoints (CRUD)
* `GET /api/obituaries` (Implement `limit`, `skip`, and projection).
* `GET /api/obituaries/:id`.
* `POST /api/obituaries` and `POST /api/condolences/:obituaryId`.

### 3.4 Definition of Done (Phase 3)
* Express server runs and connects to MongoDB.
* Postman/Swagger tests confirm CRUD APIs work with pagination and field projection.

---

## Phase 4: Backend Auth, Media & Integrations

**Objective:** Implement security, file handling, and payment logic.

### 4.1 Authentication & Security
* Implement `bcryptjs` and `jsonwebtoken`.
* Create `register`, `login`, `refresh`, `forgot-password`, and `reset-password` endpoints.
* Setup HttpOnly, Secure cookies for the refresh token.

### 4.2 Cloudinary & Stripe Integration
* Implement `multer` and Cloudinary upload logic (`f_auto`, `q_auto`, `w_1000`).
* Implement Stripe Payment Intent endpoints and Webhook listeners to update obituary statuses to `live`.
* Implement Promo Token validation logic.

### 4.3 Definition of Done (Phase 4)
* Tokens generate and refresh properly via Postman.
* Images upload successfully to Cloudinary.
* Stripe Webhooks successfully hit local endpoints (using Stripe CLI).

---

## Phase 5: API Integration & Final QA

**Objective:** Bridge the Frontend and Backend, replacing all mock data with real API calls.

### 5.1 Data Fetching & Hydration
* Replace `mockData.js` imports with Axios/Fetch calls in Next.js Server Components.
* Hook up the Login/Register forms to the Auth API and store the Access Token in memory/Zustand.
* Connect the Multi-Step form to Cloudinary endpoints and the Obituary creation API.

### 5.2 Middleware & Route Protection
* Implement Next.js Middleware to read tokens and protect `/profile` and `/admin` routes.
* Ensure SEO tags on `/obituary/[id]` are dynamically populated from the real database.

### 5.3 Definition of Done (Phase 5)
* End-to-end flow works: A new user can register, create an obituary, upload real images, pay via test Stripe card, and see it live on the homepage.
* Mock data is completely removed from the repository.