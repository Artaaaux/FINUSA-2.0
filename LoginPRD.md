PRODUCT REQUIREMENT DOCUMENT

Project: FINUSA Authentication Pages

Phase: 2

Status: Ready to Build



═══════════════════════════════════════════════════════════



OBJECTIVE:

Build login \& signup pages with email/password auth.

Design: Dark FINUSA theme, responsive, form validation.

Auth: Supabase integration (ready to use).



═══════════════════════════════════════════════════════════



FOLDER STRUCTURE:



frontend/app/

├── auth/

│   ├── login/

│   │   ├── page.tsx (login page)

│   │   └── components/

│   │       └── LoginForm.tsx

│   ├── signup/

│   │   ├── page.tsx (signup page)

│   │   └── components/

│   │       └── SignupForm.tsx

│   └── layout.tsx (shared auth layout)

├── (other pages...)



frontend/lib/

├── auth/

│   ├── supabase.ts (Supabase client)

│   └── hooks.ts (useAuth, useSignup, useLogin)



═══════════════════════════════════════════════════════════



PAGES TO CREATE:



1️⃣ LOGIN PAGE (/auth/login)

────────────────────────────



Layout:

\- Center card on dark background

\- Max width: 400px

\- Mobile: full width with padding



Components:

&#x20; Header:

&#x20;   - FINUSA Logo (40px height)

&#x20;   - "Masuk" title (H2, white)

&#x20; 

&#x20; Form:

&#x20;   - Email input (with validation)

&#x20;   - Password input (with validation)

&#x20;   - "Lupa Password?" link (right-aligned, cyan)

&#x20;   - "Sign In" button (primary, full width)

&#x20;   - Link: "Belum punya akun? Daftar" (center, cyan)



States:

&#x20; - Loading: button disabled, spinner

&#x20; - Error: red error message below input

&#x20; - Success: redirect to /dashboard



Validation:

&#x20; - Email: valid format

&#x20; - Password: min 6 chars

&#x20; - Show error on blur



═══════════════════════════════════════════════════════════



2️⃣ SIGNUP PAGE (/auth/signup)

──────────────────────────────



Layout: Same as login (centered card)



Components:

&#x20; Header:

&#x20;   - FINUSA Logo (40px height)

&#x20;   - "Daftar" title (H2, white)

&#x20; 

&#x20; Form:

&#x20;   - Email input (with validation)

&#x20;   - Password input (with validation)

&#x20;   - Confirm Password input (with validation)

&#x20;   - "Sign Up" button (primary, full width)

&#x20;   - Link: "Sudah punya akun? Masuk" (center, cyan)



States:

&#x20; - Loading: button disabled, spinner

&#x20; - Error: red error message

&#x20; - Success: redirect to /dashboard

&#x20; - Password mismatch: show warning



Validation:

&#x20; - Email: valid format, unique check

&#x20; - Password: min 6 chars

&#x20; - Confirm: must match password

&#x20; - Show strength indicator (optional v2)



═══════════════════════════════════════════════════════════



DESIGN SYSTEM (FINUSA COLORS):



Background: #0A0E27 (dark base)

Card: #1a1f3a (form container)

Input BG: #0F172A

Input Border: #1E293B

Input Focus Border: #00D9FF

Input Text: #FFFFFF

Label Text: #D1D5DB

Error Text: #EF4444

Button Primary: #2563EB → #00D9FF gradient on hover

Button Text: #FFFFFF

Link: #00D9FF

Link Hover: #00FF88



Border Radius:

\- Card: 12px (rounded-2xl)

\- Input: 8px (rounded-lg)

\- Button: 8px (rounded-lg)



Shadows:

\- Card: 0 8px 24px rgba(0,0,0,0.15)



Typography:

\- Font: Nunito

\- Title: 28px bold white

\- Label: 14px regular #D1D5DB

\- Input: 16px regular white

\- Error: 12px regular #EF4444

\- Link: 14px regular #00D9FF



═══════════════════════════════════════════════════════════



FORM COMPONENTS:



Input Field:

