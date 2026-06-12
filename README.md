# 🎵 RAAGA BHAIRAVI

RAAGA BHAIRAVI is a premium, state-of-the-art web application dedicated to promoting and showcasing Carnatic music performances, events, gallery collections, and organizational vision. Built with modern web technologies, the platform offers an immersive user experience, dynamic animations, and a secure administration panel to manage all dynamic content.

---

## 🚀 Live Demo & Deployment
- **Live Application:** [raaga-bhairavi.vercel.app](https://raaga-bhairavi.vercel.app/)
- **Deployment Platform:** Vercel (Auto-deployments on git push)

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | Modern SSR/ISR framework, React Server Components, clean routing. |
| **UI Library** | **React 19** | Core component lifecycle & state management. |
| **Styling** | **Tailwind CSS v4** | Utility-first styling with modern CSS custom properties. |
| **Animations** | **Framer Motion 12** | Liquid-smooth UI transitions, entry effects, and responsive micro-animations. |
| **Database** | **Firebase Firestore** | Real-time database storing events, performances, gallery metadata, and vision content. |
| **Media Storage** | **Supabase Storage** | High-performance CDN-backed storage for secure gallery image uploads. |
| **Authentication** | **Firebase Auth** | Google OAuth-based admin authentication with server-side email validation. |
| **Icons** | **Lucide React** | Sleek and modern SVG icons. |

---

## ✨ Key Features

### 🌟 Public-Facing Experience
* **Home Page**: Features dynamic showcase cards, the latest upcoming or past events, and pinned performances with engaging hover animations. Includes a customizable custom loading screen with musical wave animations.
* **Our Vision**: A dedicated space explaining the organization's mission, objective milestones, achievements, and structural hierarchy.
* **Events Calendar**: Clean grid display of all upcoming and completed events, dynamically queried from Firestore.
* **Music Gallery**: Responsive image grid displaying photos and media collections, utilizing Supabase Storage.
* **Performances**: Direct integrations for audio/video performances so users can listen to Carnatic recordings right on the platform.
* **Floating Utility Widgets**:
  - **WhatsApp Float**: A persistent chat trigger with a pulsating sweep shine notification indicator for instant communication.
  - **Dynamic Share Widget**: A custom curved-arrow share menu (WhatsApp, Twitter/X, Facebook, and link copy) located at the bottom-left of desktop viewports and bottom-right of mobile viewports.

---

### 🔐 Administrative Dashboard (`/admin`)
* **Secure Admin Access**: Google Sign-In authentication backed by strict whitelist email validation config (`NEXT_PUBLIC_ADMIN_EMAILS`).
* **Manage Events**: Complete CRUD interface (Create, Read, Update, Delete) to schedule, edit, or remove events.
* **Manage Gallery**: Direct integration for uploading media to Supabase Storage and storing metadata in Firestore. Includes automatic cleanup (deletes file from Supabase when removed from dashboard).
* **Manage Performances**: Interface to add performance links, dates, details, and pin specific performances to the homepage.
* **Manage Vision Content**: Dynamically edit achievements, objectives, and team descriptions without modifying code.

---

## 📂 Project Structure

```text
RAAGA-BHAIRAVI-main/
├── public/                 # Static assets (logo, home background)
├── src/
│   ├── app/                # App Router pages and layout
│   │   ├── admin/          # Admin Dashboard pages (CRUD managers)
│   │   ├── admin-login/    # Admin Login page (Google OAuth)
│   │   ├── contact/        # Contact us page
│   │   ├── events/         # Events listing page
│   │   ├── gallery/        # Gallery media gallery page
│   │   ├── performances/   # Performance list page
│   │   ├── vision/         # Vision & Achievements page
│   │   ├── globals.css     # Global styles & Tailwind configuration
│   │   └── page.tsx        # Homepage landing
│   ├── components/         # Reusable UI components (Navbar, Footer, Share, WhatsApp float)
│   └── lib/                # Database clients (Firebase, Supabase config)
├── firestore.rules         # Security rules for Cloud Firestore
├── storage.rules           # Security rules for Firebase Storage
├── next.config.ts          # Next.js configuration
├── package.json            # Scripts & project dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory and populate it with the following configuration:

```env
# --- Firebase Client Config ---
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# --- Supabase Storage Client Config ---
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# --- Admin Panel Authorization ---
# Comma-separated email list allowed to access the admin dashboard
NEXT_PUBLIC_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

---

## 🛠️ Development Setup

Follow these steps to run the application locally:

### 1. Clone & Install Dependencies
```bash
# Install packages
npm install
```

### 2. Run the Development Server
```bash
npm run dev
# The site will be available at http://localhost:3000
```

### 3. Build for Production
```bash
# Compile and build production bundle
npm run build

# Start the compiled server
npm run start
```
