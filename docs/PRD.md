# Product Requirements Document (PRD)
**Project Name:** Memorials & Obituaries Platform
**Tech Stack:** Next.js (Frontend), Express.js (Backend), MongoDB (Database)

## 1. Vision & Goals
A respectful, accessible platform where users can create, share, and view obituaries. The platform allows users to honor deceased loved ones with photos, family trees, and condolences, funded via a $25 creation fee or an admin-approved free token.

## 2. Target Audience & Roles
* **Guests:** Browse obituaries, search by location/age/name, post condolences.
* **Registered Users:** Request free tokens, pay to create obituaries, manage their posted obituaries.
* **Admins:** Manage all posts, feature obituaries, approve token requests, and generate promo codes.

## 3. Core Features
### 3.1 Homepage
* **Hero Banner & Search:** Global search bar filtering by Name, Location, City, and Age.
* **Today's Featured:** A dynamic list showcasing individuals who passed away "On This Day".
* **All-Time Memorable:** A curated grid of notable obituaries managed by the Admin.
* **Ad Section:** Dedicated placeholders for platform advertisements.

### 3.2 Obituary Creation Flow
* **Data Inputs:** Deceased details, photos, optional family tree data.
* **Payment Gate:** $25 standard fee (Stripe integration) OR a promo code/token input for free creation.

### 3.3 Memorial Page (Detail View)
* **Visuals:** Image slider of the deceased.
* **Details:** Obituary text, official news, family tree visualization.
* **Interactivity:** Social media sharing buttons.
* **Community:** A section for viewing and posting condolences.

### 3.4 User Profile
* **Dashboard:** View status of personal obituary posts (Pending, Live).
* **Token System:** A specific button to "Request Free Token" from admins.
* **Settings:** Basic profile editing.

### 3.5 Admin Panel
* **Post Management:** Edit, delete, or feature obituaries.
* **Token Management:** Review token requests and generate promo codes for approved users.

## 4. Out of Scope (v1)
* Video uploads (restrict to images to save bandwidth).
* Complex social networking features (e.g., direct messaging between users).