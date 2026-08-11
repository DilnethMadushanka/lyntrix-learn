# 🎓 Lyntrix Learn — Next-Gen Multi-Tenant Tuition & LMS SaaS Platform

![Lyntrix Learn LMS](https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80)

**Lyntrix Learn** is an ultra-modern, high-performance, multi-tenant Learning Management System (LMS) and Tuition Management SaaS platform engineered specifically for educational institutes and individual tuition masters ("sirs") across Sri Lanka.

---

## 🌟 Key Features

- 🛡️ **Anti-Piracy Video Classroom**: Live moving dynamic watermark (Student Name + Index Number + IP) gliding across the screen to prevent OBS/screen recording course piracy.
- ⚡ **Laser QR Entrance Scanner Terminal**: Ultra-fast hall gate & online check-in terminal with instant Web Audio beep feedback and real-time fee verification.
- 💳 **Automated Bank Slip Approval Pipeline**: Students upload bank deposit slips (BOC, Commercial Bank, Sampath, HNB) -> Teachers review & 1-click approve with automated SMS trigger alerts.
- 📦 **Printed Tute & Courier Delivery Tracking**: Real-time package tracking (PromptX Express / SpeedPost) for physical theory books delivered to students' doorsteps.
- 📝 **Timed MCQ Quiz & Exam Engine**: Real-time timer countdown, scoring algorithm, and detailed Sinhala explanations (විවරණ).
- 🪪 **Holographic Digital Student ID Pass**: Dynamic QR code cards for student identification and entrance.
- 👨‍🏫 **Multi-Tenant Teacher Studio**: Dedicated isolated portal for each teacher with custom subdomain, course batch builder, revenue tracking, and student CRM.
- 👑 **Super Admin SaaS Console**: Platform ARR/MRR metrics, storage bandwidth usage, and 1-click teacher onboarding.

---

## 🗄️ Supabase Database & Auth Setup

Lyntrix Learn is fully integrated with **Supabase (PostgreSQL + Auth + Storage + RLS)**.

### 1. Execute SQL Schema
1. Open your [Supabase Dashboard](https://app.supabase.com).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
4. This creates all tables (`profiles`, `teachers`, `batches`, `lessons`, `enrollments`, `bank_slips`, `attendance_logs`, `tute_deliveries`) and applies Row Level Security (RLS).

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

---

## 👨‍🏫 How to Provision Access for Tuition Masters (Sirs)

1. **Super Admin Onboarding**:
   - Go to **Super Admin Console** -> Click **"Onboard New Tuition Master"**.
   - Enter the teacher's name, subject, monthly fee, and assign a custom subdomain (e.g. `kasunmaths.lyntrix.learn`).
2. **Account Creation in Supabase**:
   - The Super Admin invites the teacher via Supabase Auth (or the teacher signs up with the assigned email).
   - In `profiles`, the teacher's `role` is set to `'teacher'`.
3. **Dedicated Teacher Hub Access**:
   - When the master logs in, Row Level Security (RLS) automatically ensures they can only view and manage their own courses, their students' enrollments, and their bank deposit slips.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/DilnethMadushanka/lyntrix-learn.git
cd lyntrix-learn

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Audio API
- **Backend / Database**: Supabase (PostgreSQL, Row Level Security, Triggers, Auth)
- **Deployment**: Vercel / Netlify / Cloudflare Pages

---

## 📄 License
MIT License © 2026 Lyntrix Learn. Crafted with excellence for Sri Lankan Education.
