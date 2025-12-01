# HelioIQ - Development Context for Claude Code

## Project Overview

HelioIQ is a GLP-1 Daily Insight Companion web application that provides AI-powered insights to help users understand daily weight fluctuations while on GLP-1 medications (semaglutide/tirzepatide).

**Primary Goal**: Answer "Why didn't I lose weight today?" with calm, scientific, reassuring explanations.

---

## Tech Stack

- **Framework**: Next.js (JavaScript - NO TypeScript per specs)
- **Styling**: TailwindCSS (dark mode native design)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **AI**: OpenAI o3-mini/Gemini 2.0 Flash API
- **Icons**: Lucide React
- **Email**: Resend

---

## Project Structure

```
helioiq/
├── specs/
│   ├── PROJECT.md          # Complete MVP specification (MAIN REFERENCE)
│   └── THOUGHTS.md         # Original concepts and future phases
├── CLAUDE.md              # This file - development context
└── README.md              # Product overview for PMs/users
```

---

## Key Architecture Principles

### 1. MVP Scope - Keep It Simple
- 8 required daily inputs only
- No TypeScript complexity
- No advanced features (notes, social, wearables)
- Focus on core insight generation

### 2. Data Flow
```
User Input (8 metrics)
    ↓
Daily Log Saved (Supabase)
    ↓
Rule Engine (JavaScript functions)
    ↓
OpenAI GPT-4 API Call
    ↓
Insight Cached (Supabase)
    ↓
Display to User
```

### 3. Rule Engine Logic
The rule engine runs **before** the AI call and detects patterns across 5 clusters:
- **Cluster 1**: Water retention patterns (sleep, steps, water intake)
- **Cluster 2**: GLP-1 medication effects (dosing timeline, early-phase variability)
- **Cluster 3**: Digestive factors (bowel movements, meal timing)
- **Cluster 4**: Nutrition alerts (protein, calorie thresholds)
- **Cluster 5**: Measurement consistency (time variance)

See [specs/PROJECT.md](specs/PROJECT.md#2-rule-engine) for full rule definitions.

### 4. AI Integration Pattern
- **Input to GPT-4**: Today's metrics + yesterday's metrics + weekly trend + triggered rules + medication timeline
- **Output Format**: JSON with three sections (reason, trend_interpretation, focus_today)
- **Tone**: 8th-grade reading level, reassuring, never judgmental
- **Caching**: Store insights in database, never regenerate unless user edits that day's log

---

## Database Schema

### Core Tables (Supabase)

```sql
-- Users (managed by Supabase Auth)
users (
  id uuid PRIMARY KEY,
  email text,
  created_at timestamp
)

-- User GLP-1 medication profile
user_profiles (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  glp1_medication text,  -- "semaglutide" | "tirzepatide" | "other"
  start_date date,
  current_dosage text,
  dosing_schedule text   -- "weekly" | "daily" | "other"
)

-- Daily metric logs
daily_logs (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  log_date date UNIQUE,  -- One log per day per user
  weight decimal,
  calories integer,
  protein integer,
  steps integer,
  water integer,
  sleep_hours decimal,
  medication_taken boolean,
  bowel_movement text,   -- "none" | "normal" | "constipated"
  created_at timestamp
)

-- AI-generated insights
insights (
  id uuid PRIMARY KEY,
  daily_log_id uuid REFERENCES daily_logs(id),
  reason text,
  trend_interpretation text,
  focus_today text,
  triggered_rules jsonb,  -- Array of rule objects
  created_at timestamp
)
```

---

## UI/UX Design System

**Full design specs**: [specs/THOUGHTS.md](specs/THOUGHTS.md#-glp-1-insight-engine--dark-mode-ui-kit-v10)

### Color Palette (Dark Mode)
- Primary Background: `#101214`
- Card Background: `#1A1D20`
- Primary Action: `#3A7FFF`
- Success: `#3EB980`
- Warning: `#FFB85C`
- Critical: `#FF6F6F`
- Body Text: `#C9CDD2`
- Labels: `#8A8F98`

### Typography
- Font: Inter
- Hero Metric: 72-96px, weight 900
- Page Title: 32px, weight 700
- Body: 16px, weight 400

### Component Patterns
- Cards: 12px border radius, 24px padding
- Buttons: 8px border radius
- Input Focus: 2px `#3A7FFF` border
- Shadows: Subtle only (`0 4px 16px rgba(0,0,0,0.5)`)




---

## MVP Pages & Routes

### `/` - Landing Page
- Unauthenticated only
- Hero + How It Works + CTA to signup

MVP Routes with Minimalism
### `/dashboard`
- One card only.
- Today’s weight (hero metric)
- One insight card (3 concise sections)
- A single CTA: “Log Today”
- Ambient, centered layout
- No sidebars, no multiple widgets

### `/log`
- Single ultra-clean form
- Only the required 8 metrics
- Soft module grouping
- Yesterday’s value shown inline, muted

### `/trends`
- One line chart
- Two cards max
- Past insights list in glass cards

### `/settings`
- Minimal list of tappable rows
- Glass surfaces with subtle chevron
- Medication info + account actions

---

### Component Interaction Guidelines
- Light parallax on cards
- Micro-springs on button tap
- Scroll easing
- Fade transitions
- Zero modals unless absolutely required
- No popovers, toasts, or alerts unless essential

---

## Key Implementation Notes

### Authentication
- Use Supabase Auth with email/password
- No email verification for MVP (reduce friction)
- Redirect to dashboard after login
- Redirect to onboarding if no user_profile exists

### Onboarding Flow
1. User signs up (email/password)
2. Redirect to `/onboarding`
3. Collect medication info (4 fields, <60 seconds)
4. Create user_profile record
5. Redirect to `/log` for first entry

### Daily Logging Rules
- Users can only log once per day (overwrite if submitted again with warning)
- Users can edit logs for the last 7 days only
- No AI call on first day (show welcome message instead)
- If AI API fails, save log and show fallback message

### Rule Engine Implementation
- Implement as JavaScript functions in `/lib/rules.js` (or similar)
- Each cluster returns an array of triggered rule objects:
  ```js
  {
    cluster: "water_retention",
    rule: "low_sleep_cortisol",
    message: "cortisol-related water retention",
    severity: "info" | "warning" | "critical"
  }
  ```
- Run server-side before AI call
- Pass triggered rules to GPT-4 system prompt

### AI Prompt Engineering
System prompt should include:
- User's medication type and start date
- Today's metrics vs. yesterday's
- Weekly trend summary
- Triggered rules from rule engine
- Instruction to output JSON with 3 sections
- Tone guidance: reassuring, 8th-grade level, never judgmental
- Safety triggers: suggest doctor if extreme patterns

Example response format:
```json
{
  "reason": "Today's slight increase is from...",
  "trend_interpretation": "You are in the expected week-1 pattern...",
  "focus_today": "Drink 2 more bottles of water, aim for 6+ hours of sleep..."
}
```

### Charting
- Use Recharts or Chart.js
- 7-day view on dashboard
- 30-day view on trends page
- Minimal interactivity: hover tooltips only
- Dark mode optimized colors (see design system)

---

## Development Workflow

### Phase 1: Foundation (Week 1-2)
- [ ] Initialize Next.js project with TailwindCSS
- [ ] Configure Supabase project and database schema
- [ ] Set up Supabase Auth
- [ ] Build routing structure
- [ ] Create dark mode color palette in Tailwind config

### Phase 2: Core Features (Week 3-4)
- [ ] Build `/log` form with validation
- [ ] Implement rule engine functions
- [ ] Set up OpenAI API integration
- [ ] Create insight generation flow
- [ ] Build dashboard with basic layout

### Phase 3: UI/UX (Week 5-6)
- [ ] Implement dark mode design system
- [ ] Add chart visualizations
- [ ] Build trends page
- [ ] Ensure mobile responsiveness
- [ ] Polish onboarding flow

### Phase 4: Testing & Launch (Week 7-8)
- [ ] User testing with beta users
- [ ] Bug fixes and edge case handling
- [ ] Performance optimization
- [ ] Deploy to Vercel
- [ ] Set up analytics

---

## Important Decisions Reference

See [specs/PROJECT.md - Questions for Clarification](specs/PROJECT.md#questions-for-clarification) for all Q&A covering:
- **Business**: Pricing ($9.99/month post-beta), no payment in MVP, 8-week timeline
- **UI/UX**: Single-page form, no streaks, mobile-first design
- **User Journey**: No email verification, inline tooltips, minimal onboarding
- **Data & Privacy**: Basic privacy policy, account deletion, no PII to OpenAI
- **Technical**: Local timezone storage, AI caching, fallback handling
- **Content**: 8th-grade reading level, reassuring tone, safety triggers

---

## Environment Variables Needed

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Resend (email)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Out of Scope for MVP

DO NOT implement these (deferred to post-MVP):
- Advanced optional inputs (sodium, carbs, stress, cycle phase)
- Notes field on daily logs
- Multi-week pattern analysis
- Export data functionality
- Social features or sharing
- Mobile native app
- Wearable/scale integrations
- Payment processing (Stripe)
- Email verification
- Guided tours or tutorials
- Streak tracking or gamification

---

## Code Style Preferences

- **JavaScript only** (NO TypeScript per specs)
- Use modern ES6+ syntax
- Functional components for React
- Server-side logic in API routes (`/pages/api/`)
- Keep components small and focused
- Use TailwindCSS classes (no CSS modules)
- Comment complex rule engine logic

---

## Testing Strategy

- Focus on manual testing for MVP
- Test cases:
  - First-time user flow (signup → onboarding → first log)
  - Daily logging (normal case)
  - Editing previous logs
  - Multiple logs in same day (overwrite warning)
  - AI API failure handling
  - Mobile responsiveness
  - Empty states (no logs yet, no data for charts)

---

## Resources & References

- **Main Spec**: [specs/PROJECT.md](specs/PROJECT.md)
- **Original Concepts**: [specs/THOUGHTS.md](specs/THOUGHTS.md)
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **OpenAI API Docs**: https://platform.openai.com/docs

---

## Quick Command Reference

```bash
# Development
npm run dev

# Build
npm run build

# Deploy to Vercel
vercel deploy

# Supabase local development (if needed)
supabase start
supabase db reset
```

---
### Development Workflow Updates
New tasks added
- Build custom Tailwind utilities for glass
- Add motion primitives (Framer Motion preferred)
- Use radial + linear gradient combos
- Implement glass containers with proper backdrop-filter

### Notes for Claude Code (Updated)
Prioritize minimalism, elegance, and white space in every component.
Default to dark mode unless theme toggle used.
All glass surfaces must use Tailwind utilities (we will define them).
Never add extra text, icons, or UI unless the spec explicitly requires it.
When unsure between functional but busy vs simple and beautiful — choose simple.
Avoid dashboards with multiple modules; always collapse into essential elements.
