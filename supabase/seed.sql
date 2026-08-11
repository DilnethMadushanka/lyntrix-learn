-- =========================================================================
-- LYNTRIX LEARN — SUPABASE DATABASE SEED DATA (INITIAL POPULATION)
-- =========================================================================
-- Copy and paste this script directly into your Supabase Dashboard SQL Editor
-- (https://app.supabase.com/project/_/sql) and click "Run".
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Comprehensive Auto-migration for all tables (Handles all past schema states)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS index_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subject_category TEXT NOT NULL DEFAULT 'maths';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 5.00;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC(10,2) NOT NULL DEFAULT 3500.00;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'Pro Academy';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'trialing';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days');
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subscription_renews_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days');
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS saas_monthly_price NUMERIC(10,2) DEFAULT 22500.00;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS is_verified_master BOOLEAN DEFAULT TRUE;

ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN DEFAULT FALSE;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS chapters JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.bank_slips ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE public.bank_slips ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.bank_slips ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 1. SEED AUTH USERS (Satisfies foreign key constraint profiles_id_fkey)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token
)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'admin@lyntrix.learn',
    crypt('SuperAdmin@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Lyntrix Super Admin","role":"super_admin"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'kasun.maths@lyntrix.learn',
    crypt('MasterKasun@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Eng. Kasun Ranasinghe","role":"teacher","subject":"Combined Mathematics"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'amila.chem@lyntrix.learn',
    crypt('MasterAmila@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Dr. Amila Fernando","role":"teacher","subject":"Chemistry"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'dilshan.ict@lyntrix.learn',
    crypt('MasterDilshan@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Dilshan Wijesinghe","role":"teacher","subject":"ICT"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  ),
  (
    'b0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'nimesh.f@gmail.com',
    crypt('StudentNimesh@123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Nimesh Fernando","role":"student","index_number":"LYN-26-8821"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'tharushi.k@gmail.com',
    crypt('StudentTharushi@123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Tharushi Kaveesha","role":"student","index_number":"LYN-26-8822"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'kavindu.d@gmail.com',
    crypt('StudentKavindu@123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Kavindu Dilshan","role":"student","index_number":"LYN-25-7719"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email;

-- 2. SEED PROFILES
INSERT INTO public.profiles (id, name, email, phone, role, avatar_url, index_number, district, address)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Lyntrix Super Admin', 'admin@lyntrix.learn', '+94 11 200 9900', 'super_admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', 'ADMIN-01', 'Colombo', 'Lyntrix Head Office, Colombo 03'),
  ('a0000000-0000-0000-0000-000000000002', 'Eng. Kasun Ranasinghe', 'kasun.maths@lyntrix.learn', '+94 77 123 4567', 'teacher', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', 'INS-KM', 'Gampaha', 'Kasun Maths Hall, Nugegoda'),
  ('a0000000-0000-0000-0000-000000000003', 'Dr. Amila Fernando', 'amila.chem@lyntrix.learn', '+94 71 987 6543', 'teacher', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 'INS-AC', 'Colombo', 'Apex Academy, Kandy'),
  ('a0000000-0000-0000-0000-000000000004', 'Dilshan Wijesinghe', 'dilshan.ict@lyntrix.learn', '+94 76 555 1234', 'teacher', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', 'INS-DI', 'Kurunegala', 'Syzygy Institute, Gampaha'),
  ('b0000000-0000-0000-0000-000000000001', 'Nimesh Fernando', 'nimesh.f@gmail.com', '+94 77 456 7890', 'student', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200', 'LYN-26-8821', 'Colombo', 'No 45, Temple Road, Maharagama'),
  ('b0000000-0000-0000-0000-000000000002', 'Tharushi Kaveesha', 'tharushi.k@gmail.com', '+94 71 333 4455', 'student', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', 'LYN-26-8822', 'Gampaha', 'No 12, Kandy Road, Yakkala'),
  ('b0000000-0000-0000-0000-000000000003', 'Kavindu Dilshan', 'kavindu.d@gmail.com', '+94 70 888 9900', 'student', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', 'LYN-25-7719', 'Kandy', 'No 88, Peradeniya Road, Kandy')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- 3. SEED TEACHERS (Masters)
INSERT INTO public.teachers (
  id, 
  user_id, 
  name, 
  title, 
  subject, 
  subject_category, 
  subdomain, 
  avatar_url, 
  cover_url, 
  rating, 
  monthly_fee, 
  bio, 
  subscription_tier, 
  subscription_status, 
  trial_started_at,
  trial_ends_at,
  subscription_renews_at,
  saas_monthly_price,
  is_verified_master
)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'Eng. Kasun Ranasinghe',
    'B.Sc. Eng (Hons) Moratuwa',
    'Combined Mathematics',
    'maths',
    'kasun-maths',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200',
    4.98,
    3500.00,
    'Top Combined Maths lecturer in Sri Lanka with island 1st rank results.',
    'Pro Academy',
    'trialing',
    NOW(),
    NOW() + INTERVAL '12 days',
    NOW() + INTERVAL '12 days',
    22500.00,
    TRUE
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000003',
    'Dr. Amila Fernando',
    'Ph.D. Chemistry (UK)',
    'Chemistry',
    'science',
    'amila-chem',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200',
    4.95,
    3500.00,
    'Simplified Organic Chemistry mechanisms with graphical memory tricks.',
    'Pro Academy',
    'active',
    NOW(),
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '30 days',
    22500.00,
    TRUE
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000004',
    'Dilshan Wijesinghe',
    'B.Sc. IT (Moratuwa), Cloud Architect',
    'Information & Comm. Tech (ICT)',
    'technology',
    'dilshan-ict',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    4.92,
    3000.00,
    'Master ICT syllabus from Python programming to Database Systems.',
    'Pro Academy',
    'trialing',
    NOW(),
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days',
    22500.00,
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject;

-- 4. SEED BATCHES
INSERT INTO public.batches (
  id, 
  teacher_id, 
  code, 
  title, 
  grade_year, 
  medium, 
  schedule, 
  monthly_fee, 
  zoom_link, 
  description,
  status
)
VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'MATHS-2025-TH',
    '2025 A/L Combined Maths — Full Theory Masterclass',
    '2025 A/L',
    'Sinhala Medium',
    'Every Sunday 7:30 AM - 1:00 PM',
    3500.00,
    'https://zoom.us/j/9988221100',
    'Comprehensive pure and applied mathematics syllabus coverage with step-by-step past paper discussion.',
    'active'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'MATHS-2026-TH',
    '2026 A/L Combined Maths — Foundation & Theory',
    '2026 A/L',
    'Sinhala Medium',
    'Every Saturday 8:00 AM - 12:30 PM',
    3500.00,
    'https://zoom.us/j/9988221101',
    'New batch start for 2026 A/L students covering quadratic equations, trigonometry, and calculus basics.',
    'active'
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000002',
    'CHEM-2025-REV',
    '2025 A/L Chemistry — Organic & Physical Masterclass',
    '2025 A/L',
    'Sinhala Medium',
    'Every Tuesday 3:30 PM - 7:30 PM',
    3500.00,
    'https://zoom.us/j/9988221102',
    'Speed revision with fast theory summaries and unit-by-unit MCQ paper evaluations.',
    'active'
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000003',
    'ICT-2025-TH',
    '2025 A/L ICT — Python, Database & Networking',
    '2025 A/L',
    'English & Sinhala Medium',
    'Every Thursday 3:00 PM - 6:30 PM',
    3000.00,
    'https://zoom.us/j/9988221103',
    'Hands-on coding, ER diagrams, SQL database normalization, and network topology masterclass.',
    'active'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  schedule = EXCLUDED.schedule;

-- 5. SEED VIDEO LESSONS (Classroom Recordings)
INSERT INTO public.lessons (
  id, 
  batch_id, 
  teacher_id, 
  title, 
  unit, 
  duration, 
  video_url, 
  thumbnail_url, 
  notes_pdf_url, 
  description, 
  views_count, 
  has_quiz
)
VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Lesson 01: Integration Masterclass (අනුකලනය මූලධර්ම)',
    'Pure Mathematics',
    '2h 45m',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'Comprehensive breakdown of trigonometric substitutions, partial fractions, and integration by parts.',
    284,
    TRUE
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Lesson 02: Complex Numbers & De Moivre Theorem (සංකීර්ණ සංඛ්‍යා)',
    'Pure Mathematics',
    '2h 15m',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'Argand diagrams, roots of unity, and polar form representation simplified.',
    192,
    FALSE
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000002',
    'Lesson 01: Organic Reaction Mechanisms & Conversions',
    'Organic Chemistry',
    '3h 10m',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'Electrophilic additions, Grignard reagent pathways, and aromatic substitution reactions.',
    310,
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title;

-- 6. SEED ENROLLMENTS
INSERT INTO public.enrollments (
  id,
  student_id, 
  batch_id, 
  payment_status, 
  paid_date, 
  syllabus_progress, 
  attendance_rate
)
VALUES
  ('11000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Paid', '2026-08-01', 65, 100),
  ('11000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'Pending', NULL, 20, 92),
  ('11000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Paid', '2026-08-02', 80, 98)
ON CONFLICT (student_id, batch_id) DO UPDATE SET
  payment_status = EXCLUDED.payment_status;

-- 7. SEED BANK DEPOSIT SLIPS
INSERT INTO public.bank_slips (
  id, 
  student_id, 
  teacher_id, 
  batch_id, 
  student_name, 
  student_index, 
  student_phone, 
  amount, 
  bank_name, 
  reference_no, 
  slip_image_url, 
  status, 
  remarks
)
VALUES
  (
    'f0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'Nimesh Fernando',
    'LYN-26-8821',
    '+94 77 456 7890',
    3500.00,
    'Commercial Bank Online (App)',
    'REF-COM-882910',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    'pending',
    'August monthly class fee transfer.'
  ),
  (
    'f0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'Tharushi Kaveesha',
    'LYN-26-8822',
    '+94 71 333 4455',
    3500.00,
    'Bank of Ceylon (BOC CDM Machine)',
    'REF-BOC-102948',
    'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600',
    'approved',
    'CDM Cash deposit verified.'
  )
ON CONFLICT (id) DO NOTHING;

-- 8. SEED ATTENDANCE LOGS
INSERT INTO public.attendance_logs (
  id, 
  student_id, 
  teacher_id, 
  batch_id, 
  student_name, 
  student_index, 
  scan_type, 
  status, 
  fee_status
)
VALUES
  ('70000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Nimesh Fernando', 'LYN-26-8821', 'Hall Scanner Gate 01', 'Present', 'Paid'),
  ('70000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Tharushi Kaveesha', 'LYN-26-8822', 'Hall Scanner Gate 01', 'Present', 'Paid')
ON CONFLICT (id) DO NOTHING;

-- 9. SEED TUTE DELIVERIES
INSERT INTO public.tute_deliveries (
  id, 
  student_id, 
  batch_id, 
  pack_title, 
  courier_name, 
  tracking_number, 
  delivery_status, 
  destination_address
)
VALUES
  ('80000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'August Combined Maths Theory + Paper Pack', 'PromptX Express', 'PRX-998822', 'Dispatched', 'No 45, Temple Road, Maharagama')
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Teachers Table
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers viewable by all" ON public.teachers;
CREATE POLICY "Teachers viewable by all" ON public.teachers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert teachers" ON public.teachers;
CREATE POLICY "Public insert teachers" ON public.teachers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update teachers" ON public.teachers;
CREATE POLICY "Public update teachers" ON public.teachers FOR UPDATE USING (true);

