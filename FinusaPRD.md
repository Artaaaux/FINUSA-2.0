PROJECT NAME: FINUSA (Finance Nusantara)

VERSION: 2.0 - Frontend Phase

DATE: 2024

STATUS: In Development



═══════════════════════════════════════════════════════════



1\. PROJECT OVERVIEW

═══════════════════════════════════════════════════════════



Project Name: FINUSA - Financial Literacy Web Application

Target Users: Mahasiswa (College Students) + UMKM Owners

Primary Goal: Educate Indonesians about financial literacy and help manage finances

Development Approach: Solo project, vibe coding, intended for public use

Deployment: Vercel (frontend free) + Railway (backend \~$5/month, future phase)



Project Scope:

\- Web-first development (desktop responsive + mobile responsive)

\- Full Frontend Development Phase (current priority)

\- Backend Integration Phase (future)

\- Mobile App Phase (future - React Native)



Database: Supabase (Free Tier) - Already set up with 10 tables and RLS policies

Technology Stack: Node.js + React + TypeScript + Tailwind CSS + Shadcn/UI + Framer Motion



═══════════════════════════════════════════════════════════



2\. TECH STACK CONFIRMATION

═══════════════════════════════════════════════════════════



Frontend:

✓ Framework: React 18+ with TypeScript

✓ Build Tool: Vite

✓ Styling: Tailwind CSS

✓ Component Library: Shadcn/UI

✓ Animation: Framer Motion

✓ Icons: Lucide React

✓ State Management: Zustand (for future)

✓ HTTP Client: TanStack Query / Axios (for future)



Dev Tools:

✓ Code Editor: Cursor / Codex / Antigravity

✓ Type Checking: TypeScript

✓ Linting: ESLint

✓ Formatting: Prettier



Backend (FUTURE):

\- Node.js + Express + TypeScript

\- Supabase PostgreSQL

\- JWT Authentication

\- Groq API (AI)

\- Finnhub API (Market Data)

\- Google Sheets API



═══════════════════════════════════════════════════════════



3\. PROJECT PHASES (WATERFALL APPROACH)

═══════════════════════════════════════════════════════════



PHASE 1: LANDING PAGE (CURRENT PRIORITY)

Status: In Development

Deliverables:

&#x20; ├─ Navbar with animated menu

&#x20; ├─ Hero section with animations

&#x20; ├─ Features showcase (3 pillars)

&#x20; ├─ Trust signals section

&#x20; ├─ CTA buttons

&#x20; ├─ Footer

&#x20; └─ Full responsive (desktop + mobile)

Timeline: THIS WEEK

Tools: Myna Hero (21st.dev) + Glow Menu (21st.dev) + Custom Animations



PHASE 2: LOGIN / SIGNUP PAGES

Status: Pending

Deliverables:

&#x20; ├─ Login page

&#x20; ├─ Signup page

&#x20; ├─ Password recovery

&#x20; ├─ Form validation UI

&#x20; └─ Responsive design

Timeline: AFTER Phase 1 Complete



PHASE 3: MAIN APP PAGES (One by One)

Status: Pending

Deliverables (in order):

&#x20; ├─ 3.1 Home/Onboarding page

&#x20; ├─ 3.2 AI Chat page

&#x20; ├─ 3.3 Monitor Keuangan page

&#x20; ├─ 3.4 Save Money page

&#x20; ├─ 3.5 Financial Management/Bookkeeping page

&#x20; ├─ 3.6 Google Sheets page

&#x20; ├─ 3.7 Settings page

&#x20; └─ 3.8 Admin Panel (if time permits)

Timeline: AFTER Phase 2 Complete



PHASE 4: BACKEND INTEGRATION (SEPARATE PROJECT)

Status: Design Phase Complete (waiting for frontend)

Deliverables:

&#x20; ├─ API Endpoints

&#x20; ├─ Authentication

&#x20; ├─ Database Queries

&#x20; ├─ Business Logic

&#x20; └─ Third-party API Integration

Timeline: AFTER All Frontend Complete



PHASE 5: MOBILE APP (REACT NATIVE)

Status: Future - Not in scope yet

Timeline: After backend stable



═══════════════════════════════════════════════════════════



4\. DESIGN SYSTEM (ALREADY DESIGNED)

═══════════════════════════════════════════════════════════



COLOR PALETTE:

&#x20; Primary: #2563EB (Blue)

&#x20; Accent: #9333EA (Purple)

&#x20; Success: #10B981 (Green)

&#x20; Warning: #F59E0B (Orange)

&#x20; Danger: #EF4444 (Red)

&#x20; Background: #FAFAF9 (Light)

&#x20; Dark BG: #0F172A (Dark)

&#x20; Text: #1F2937 (Dark text)

&#x20; Light Text: #6B7280

&#x20; Border: #E5E7EB

&#x20; White: #FFFFFF



TYPOGRAPHY (Nunito Font Family):

&#x20; H1: 40px, Weight 700

&#x20; H2: 28px, Weight 700

&#x20; H3: 20px, Weight 700

&#x20; Body Large: 18px, Weight 400, Line-height 1.7

&#x20; Body: 15px, Weight 400, Line-height 1.6

&#x20; Small: 13px, Weight 400, Line-height 1.5



SPACING SYSTEM:

&#x20; 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px



BORDER RADIUS:

&#x20; Buttons: 8px

&#x20; Cards: 12px

&#x20; Inputs: 8px

&#x20; Small elements: 4px



RESPONSIVE BREAKPOINTS:

&#x20; Desktop: 1440px (primary design target)

&#x20; Tablet: 768px

&#x20; Mobile: 375px (iPhone SE size)



COMPONENTS AVAILABLE (Shadcn/UI):

&#x20; ✓ Button

&#x20; ✓ Input

&#x20; ✓ Label

&#x20; ✓ Sheet (Mobile menu)

&#x20; ✓ Card

&#x20; ✓ And more as needed



═══════════════════════════════════════════════════════════



5\. CODE STANDARDS \& GUIDELINES

═══════════════════════════════════════════════════════════



Project Structure:

&#x20; src/

&#x20; ├── app/                 # Next.js app router

&#x20; ├── components/

&#x20; │   ├── ui/             # Shadcn components

&#x20; │   ├── sections/       # Page sections

&#x20; │   └── layout/         # Navbar, Footer, etc

&#x20; ├── lib/

&#x20; │   ├── utils.ts        # Utility functions

&#x20; │   └── constants.ts    # App constants

&#x20; ├── types/              # TypeScript types

&#x20; ├── hooks/              # Custom React hooks

&#x20; └── styles/             # Global styles



TypeScript:

&#x20; ✓ Strict mode enabled

&#x20; ✓ Type all props

&#x20; ✓ Type all state

&#x20; ✓ Use interfaces for component props



React Best Practices:

&#x20; ✓ Use functional components

&#x20; ✓ Use hooks (useState, useEffect, useContext, etc)

&#x20; ✓ Component composition over inheritance

&#x20; ✓ Memoization where performance matters

&#x20; ✓ Proper key usage in lists

&#x20; ✓ Avoid prop drilling (use context/zustand if needed)



Naming Conventions:

&#x20; ✓ Components: PascalCase (e.g., MyComponent)

&#x20; ✓ Functions: camelCase (e.g., myFunction)

&#x20; ✓ Files: kebab-case for files (e.g., my-component.tsx)

&#x20; ✓ Constants: UPPER\_SNAKE\_CASE

&#x20; ✓ CSS classes: lowercase with hyphens



Tailwind CSS:

&#x20; ✓ Use Tailwind classes (no custom CSS if possible)

&#x20; ✓ Mobile-first approach

&#x20; ✓ Use @apply for reusable styles only

&#x20; ✓ Keep responsive modifiers clean



Framer Motion:

&#x20; ✓ Use for animations only

&#x20; ✓ Smooth transitions (200-500ms)

&#x20; ✓ Performance-optimized animations

&#x20; ✓ useInView for scroll animations



═══════════════════════════════════════════════════════════



6\. EXTERNAL COMPONENTS \& RESOURCES

═══════════════════════════════════════════════════════════



Myna Hero (21st.dev):

Command: npx shadcn@latest add https://21st.dev/r/bankkroll/myna-hero

Location: src/components/ui/myna-hero.tsx

Purpose: Landing page hero section with animations

Features:

&#x20; ✓ Animated title with staggered words

&#x20; ✓ Feature showcase cards

&#x20; ✓ Smooth transitions

&#x20; ✓ Mobile responsive



Glow Menu (21st.dev):

Command: npx shadcn@latest add https://21st.dev/r/spoonyvu/glow-menu

Location: src/components/ui/glow-menu.tsx

Purpose: Animated navigation menu

Features:

&#x20; ✓ 3D flip animation on hover

&#x20; ✓ Glow effect

&#x20; ✓ Active state indicator

&#x20; ✓ Customizable menu items

&#x20; ✓ Light/Dark theme support



Dependencies to Install:

&#x20; npm install lucide-react framer-motion @radix-ui/react-slot class-variance-authority @radix-ui/react-dialog @radix-ui/react-label next-themes



═══════════════════════════════════════════════════════════



7\. PROJECT CONSTRAINTS \& RULES

═══════════════════════════════════════════════════════════



Supabase Free Tier Limitations:

&#x20; ✓ 2GB/month bandwidth

&#x20; ✓ 50MB/day API limit

&#x20; ✓ Sufficient for MVP (up to 5K users)

&#x20; ✓ Monitor usage - upgrade if needed



Free Tools Used:

&#x20; ✓ Cursor / Codex / Antigravity (AI coding)

&#x20; ✓ Shadcn/UI components (free, open source)

&#x20; ✓ Framer Motion (free tier)

&#x20; ✓ Lucide Icons (free)

&#x20; ✓ Vercel deployment (free tier)



DO's:

&#x20; ✓ Keep animations smooth and purposeful

&#x20; ✓ Mobile-first responsive design

&#x20; ✓ Accessibility in mind (WCAG AAA)

&#x20; ✓ Performance optimized (Lighthouse score 90+)

&#x20; ✓ Proper error handling

&#x20; ✓ User-friendly feedback (loading, error states)

&#x20; ✓ Document code with comments for clarity



DON'Ts:

&#x20; ✗ Don't use custom CSS if Tailwind can do it

&#x20; ✗ Don't create duplicate components

&#x20; ✗ Don't hardcode values (use constants)

&#x20; ✗ Don't skip TypeScript types

&#x20; ✗ Don't create over-complex animations

&#x20; ✗ Don't forget mobile responsiveness

&#x20; ✗ Don't commit without testing



═══════════════════════════════════════════════════════════



8\. DEVELOPMENT WORKFLOW

═══════════════════════════════════════════════════════════



Step 1: Create new page/component

Step 2: Design on paper or Figma (optional)

Step 3: Implement with TypeScript

Step 4: Add Tailwind CSS styling

Step 5: Add Framer Motion animations

Step 6: Test responsiveness (1440px, 768px, 375px)

Step 7: Test on real devices

Step 8: Code review / self-check

Step 9: Commit with clear message



Git Commit Messages:

&#x20; ✓ feat: Add landing page hero section

&#x20; ✓ fix: Fix navbar mobile menu bug

&#x20; ✓ style: Update color scheme for better contrast

&#x20; ✓ refactor: Extract button component

&#x20; ✓ chore: Update dependencies



═══════════════════════════════════════════════════════════



9\. SUCCESS METRICS

═══════════════════════════════════════════════════════════



Landing Page Success:

&#x20; ✓ Page loads in <3 seconds

&#x20; ✓ Lighthouse score 90+ (Performance)

&#x20; ✓ Mobile responsive (375px-1440px)

&#x20; ✓ All animations smooth (60 FPS)

&#x20; ✓ All links functional

&#x20; ✓ Proper error handling



Overall Frontend Success:

&#x20; ✓ All 7 pages built + responsive

&#x20; ✓ Consistent design system

&#x20; ✓ No console errors

&#x20; ✓ Accessibility compliant

&#x20; ✓ Performance optimized

&#x20; ✓ Code well-documented



═══════════════════════════════════════════════════════════



10\. IMPORTANT NOTES FOR AI CODING ASSISTANTS

═══════════════════════════════════════════════════════════



When implementing features:

&#x20; 1. Always check existing components before creating new ones

&#x20; 2. Use the design system colors and typography exactly

&#x20; 3. Implement mobile responsiveness from start (not afterthought)

&#x20; 4. Add loading states for all interactive elements

&#x20; 5. Add error boundaries for better UX

&#x20; 6. Test all animations on mobile (they should be smooth)

&#x20; 7. Follow TypeScript strict mode

&#x20; 8. Use semantic HTML

&#x20; 9. Add ARIA labels for accessibility

&#x20; 10. Optimize images (use Next.js Image component)



When unsure:

&#x20; 1. Check the design system first

&#x20; 2. Reference existing components

&#x20; 3. Ask for clarification in comments

&#x20; 4. Keep it simple before making it complex

&#x20; 5. Mobile-first always



═══════════════════════════════════════════════════════════

