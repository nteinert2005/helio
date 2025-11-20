# HelioIQ - MVP Specification

## Project Overview

**HelioIQ** is a GLP-1 Daily Insight Companion that helps users understand daily weight fluctuations and health metrics while on GLP-1 medications (semaglutide/tirzepatide). The app provides AI-powered insights to answer "Why didn't I lose weight today?" and "What's happening inside my body?"

## Tech Stack

- **Frontend**: Next.js (JavaScript, NO TypeScript)
- **Styling**: TailwindCSS
- **Hosting**: Vercel
- **Database**: Supabase
- **Icons**: Lucide React
- **Email**: Resend

## MVP Scope

### Core Features

1. **Daily Metric Logging**
2. **AI-Powered Insights**
3. **Weight Trend Visualization**
4. **Rule-Based Pattern Detection**

---

## 1. Required Inputs (MVP Only)

Users must log these metrics daily:

- **Daily Weight** (lbs)
- **Calories** (rough estimate or logged)
- **Protein Intake** (grams)
- **Steps** (count)
- **Water** (oz or glasses)
- **Sleep Hours** (hours)
- **Medication Day** (yes/no)
- **Bowel Movements** (none / normal / constipated)

---

## 2. Rule Engine

The system applies rule clusters to detect patterns:

### Cluster 1: Water Retention Patterns
- High sodium + weight increase (0.5-2.5 lb) → sodium-related water retention
- Low sleep (<6 hrs) + weight increase → cortisol-related water retention
- Low steps (<3,000) + low water → stagnant water retention

### Cluster 2: GLP-1 Medication Effects
- Recent dose (1-4 days ago) → delayed GI emptying
- Week 1-2 → normal early-phase variability
- Weight stable 2-3 days + calories < maintenance → drop coming soon

### Cluster 3: Digestive Factors
- No bowel movement → constipation artificially raising weight
- Last meal <8 hrs before weigh-in → food still digesting

### Cluster 4: Nutrition Alerts
- Protein <60g → potential fat burn stalling
- Calories <900 → body stress causing temporary water retention

### Cluster 5: Measurement Consistency
- Weigh-in times differ >60 minutes OR different scale → measurement variability

---

## 3. AI Reasoner (GPT Integration)

The AI receives:
- Today's metrics
- Yesterday's metrics
- Weekly trend data
- Triggered rules
- User's GLP-1 dose timeline

The AI outputs:
- **Reason for today's number**: Calm, factual explanation
- **Trend interpretation**: Context on weekly/monthly patterns
- **Today's focus**: Actionable next steps

### Example Output Format

**Reason for today's number:**
"Today's slight increase is from a combination of high sodium, low sleep, and lack of a bowel movement — all of which create temporary water retention. This is not fat gain."

**Trend interpretation:**
"You are in the expected week-1 GLP-1 pattern where weight loss comes in drops rather than daily losses. Nothing in your data suggests lack of progress."

**Today's focus:**
"Drink 2 more bottles of water, aim for 6+ hours of sleep, and try a short walk. This will help your body flush retained water."

---

## 4. UI/UX Design System

### Dark Mode Theme

#### Background Layers
- Primary Background: `#101214`
- Secondary Surface (cards/modals): `#1A1D20`
- Tertiary Surface (charts): `#2A2F33`
- Dividers: `#3A3F47`

#### Typography (Inter Font)
- Hero Metric: 72-96px, weight 900, `#FFFFFF`
- Page Title: 32px, weight 700, `#FFFFFF`
- Body Text: 16px, weight 400, `#C9CDD2`
- UI Labels: 14px, weight 500, `#8A8F98`

#### Colors
- Primary Action: `#3A7FFF`
- Secondary Highlight: `#7FD1E8`
- Positive/Success: `#3EB980`
- Warning: `#FFB85C`
- Critical Alert: `#FF6F6F`

#### Buttons
- Primary: Background `#3A7FFF`, Text `#FFFFFF`, 8px radius
- Secondary: Background `#2A2F33`, Text/Border `#3A7FFF`
- Hover: `#5A9BFF`

#### Input Fields
- Background: `#1A1D20`
- Text: `#FFFFFF`
- Placeholder: `#8A8F98`
- Border: `#3A3F47`
- Focus Border: `#3A7FFF` 2px

#### Cards
- Background: `#1A1D20`
- Shadow: `0 4px 16px rgba(0,0,0,0.5)`
- Border Radius: 12px
- Padding: 24px

---

## 5. MVP User Flow

### Onboarding
1. User creates account
2. User inputs initial GLP-1 medication info (drug type, start date, dosage)
3. User enters first day's metrics

### Daily Flow
1. User logs daily metrics (8 required inputs)
2. System runs rule engine on submitted data
3. AI generates personalized insight based on:
   - Current metrics
   - Historical data
   - Triggered rules
4. User views:
   - Today's weight vs. yesterday
   - AI-generated insight (3 sections)
   - Simple weight trend chart (7-day)

### Dashboard
- Current weight (hero display)
- Today's insight card
- 7-day weight trend graph
- Quick log button for today's metrics

---

## 6. Database Schema (Supabase)

### Tables

#### users
- id (uuid, primary key)
- email (text)
- created_at (timestamp)

#### user_profiles
- id (uuid, primary key)
- user_id (uuid, foreign key)
- glp1_medication (text) - "semaglutide" or "tirzepatide"
- start_date (date)
- current_dosage (text)

#### daily_logs
- id (uuid, primary key)
- user_id (uuid, foreign key)
- log_date (date)
- weight (decimal)
- calories (integer)
- protein (integer)
- steps (integer)
- water (integer)
- sleep_hours (decimal)
- medication_taken (boolean)
- bowel_movement (text) - "none", "normal", "constipated"
- created_at (timestamp)

#### insights
- id (uuid, primary key)
- daily_log_id (uuid, foreign key)
- reason (text)
- trend_interpretation (text)
- focus_today (text)
- triggered_rules (jsonb)
- created_at (timestamp)

---

## 7. MVP Pages

### `/` - Landing Page
- Hero section explaining the problem
- How it works (3 steps)
- CTA to sign up

### `/dashboard` - Main Dashboard
- Weight hero metric
- Today's insight card
- 7-day trend chart
- "Log Today" button

### `/log` - Daily Input Form
- Form with 8 required fields
- Submit button
- Shows yesterday's values as reference

### `/trends` - Historical View
- Weight graph (30 days)
- Metric correlations (simple table view)
- Past insights list

### `/settings` - User Settings
- GLP-1 medication info
- Profile settings
- Account management

---

## 8. Success Metrics

### User Engagement
- Daily active logging rate >70%
- Average session time >3 minutes
- Weekly retention >80%

### Product Validation
- User finds insights "helpful" (survey >4/5)
- Reduced anxiety about weight fluctuations (qualitative feedback)
- Users share with friends (referral rate >10%)

---

## 9. Technical Implementation Notes

### AI Integration
- Use OpenAI GPT-4 API
- System prompt includes:
  - Rule engine outputs
  - User's medication timeline
  - Instruction to be calm, reassuring, scientific
- Response format: JSON with three sections

### Rule Engine
- Implement as JavaScript functions
- Run server-side before AI call
- Return array of triggered rules with metadata

### Charts
- Use lightweight library (Recharts or Chart.js)
- Keep minimal, clean, dark-mode optimized
- 7-day view for MVP, 30-day for trends page

---

## 10. Out of Scope for MVP

### Deferred to Post-MVP
- Advanced optional inputs (sodium, carbs, stress, cycle phase, etc.)
- Multi-week pattern analysis
- Export data functionality
- Social features
- Mobile app (start web-only)
- Integration with wearables/scales
- Telehealth features
- Predictive modeling

---

## 11. Development Phases

### Phase 1: Foundation (Week 1-2)
- Set up Next.js project with TailwindCSS
- Configure Supabase database
- Implement authentication
- Build basic routing structure

### Phase 2: Core Features (Week 3-4)
- Daily log form with validation
- Database integration
- Rule engine implementation
- OpenAI API integration

### Phase 3: UI/UX (Week 5-6)
- Dashboard design
- Chart implementation
- Responsive design
- Dark mode polish

### Phase 4: Testing & Launch (Week 7-8)
- User testing
- Bug fixes
- Performance optimization
- Deploy to Vercel

---

## 12. Key Differentiators

1. **GLP-1 Specific**: Built exclusively for semaglutide/tirzepatide users
2. **Context-Aware AI**: Explains *why* based on actual physiological patterns
3. **Reassurance-First**: Reduces anxiety, not just tracks data
4. **Simple MVP**: 8 inputs only, no feature bloat
5. **Dark Mode Native**: Designed for late-night logging

---

## Questions for Clarification

### Business & Monetization

**Q1: What is the pricing model for MVP launch?**
- **Default Answer**: Free during beta testing (first 100 users), then $9.99/month subscription after validation. No free tier to maintain quality and commitment from users.

**Q2: Do we need payment processing in MVP?**
- **Default Answer**: No. Launch free beta first, add Stripe integration post-MVP once we validate user retention and satisfaction metrics.

**Q3: What is the target launch date?**
- **Default Answer**: 8 weeks from development start (aligned with Phase 4 completion). Soft launch to close network first, then public launch after 2 weeks of feedback.

**Q4: How will we acquire initial users?**
- **Default Answer**: Personal network, GLP-1 Reddit communities (r/Ozempic, r/Mounjaro, r/Semaglutide), Facebook groups. No paid ads for MVP. Target: 50-100 beta users.

**Q5: What email communications do we need for MVP?**
- **Default Answer**: Welcome email, daily reminder to log metrics (optional opt-in), weekly summary email with trend insights. Using Resend for transactional emails only.

---

### UI/UX Details

**Q6: Should users be able to edit past log entries?**
- **Default Answer**: Yes, but only for the last 7 days. Add "Edit" button on each day's entry in the trends view. Prevents historical data manipulation while allowing mistake corrections.

**Q7: What happens if a user misses a day of logging?**
- **Default Answer**: Dashboard shows a "You haven't logged today yet" message with a prominent "Log Now" button. No penalties or streaks for MVP—keep it low-pressure. AI insights will note gaps in data but stay reassuring.

**Q8: How should we handle first-time users with no historical data?**
- **Default Answer**: After first log entry, show a simplified insight: "Welcome! Your first entry is logged. Come back tomorrow to start seeing personalized insights based on your trends." No AI call on day 1 to save costs.

**Q9: Should the daily log form be a single page or multi-step?**
- **Default Answer**: Single page with all 8 inputs visible at once. Use a clean vertical layout with input groupings: Weight & Medication | Nutrition (calories, protein, water) | Activity (steps, sleep) | Digestion. Reduces friction, increases completion rate.

**Q10: Do we show the triggered rules to the user?**
- **Default Answer**: No, keep them under the hood. Users see only the AI-generated narrative. Showing raw rules would be too technical and reduce the "magic" of the insights.

**Q11: What should the empty state look like on dashboard before first log?**
- **Default Answer**: Hero section says "Ready to start your journey?" with a large "Log Your First Day" button. Below that, show a preview of what the dashboard will look like (with sample/blurred data) to set expectations.

**Q12: Should charts be interactive (hover tooltips, zoom, etc.)?**
- **Default Answer**: Minimal interaction for MVP. Hover shows exact value and date, but no zoom or complex interactions. Keep it simple and fast to render.

---

### User Journey & Onboarding

**Q13: How detailed should the onboarding medication questions be?**
- **Default Answer**: Keep it minimal:
  - Medication type (dropdown: Semaglutide/Tirzepatide/Other GLP-1)
  - Start date (date picker)
  - Current dosage (text input with examples like "0.25mg", "2.5mg")
  - Dosing schedule (dropdown: Weekly/Daily/Other)

This takes <60 seconds to complete.

**Q14: Should we require email verification before users can start logging?**
- **Default Answer**: No email verification for MVP. Let users start logging immediately after signup to reduce friction. Add verification post-MVP if spam becomes an issue.

**Q15: Do we need a tutorial or guided tour on first login?**
- **Default Answer**: No modal tour. Instead, use inline contextual hints on the first log form (light tooltips explaining why we ask for each metric). Keep it unobtrusive and skippable.

**Q16: What if a user wants to track multiple GLP-1 medications or switches mid-journey?**
- **Default Answer**: Out of scope for MVP. Assume one medication per user. Add "Update Medication" option in settings that updates going forward but doesn't retroactively change historical data.

---

### Data & Privacy

**Q17: What data privacy/compliance do we need for MVP?**
- **Default Answer**: Basic privacy policy and terms of service (standard templates). State clearly that data is stored securely in Supabase, not shared with third parties, and only used for generating insights. HIPAA compliance is post-MVP (not required unless we integrate with healthcare providers).

**Q18: Can users delete their account and all data?**
- **Default Answer**: Yes. Add "Delete Account" button in settings that permanently removes all user data from Supabase. Show a confirmation modal: "This will permanently delete all your logs and insights. This cannot be undone."

**Q19: Do we need to anonymize data for AI processing?**
- **Default Answer**: No PII is sent to OpenAI. Only numeric metrics, dates, and medication type. No email, name, or user ID. Safe for MVP.

---

### Technical Details

**Q20: How do we handle timezone differences for logging?**
- **Default Answer**: Store all dates/times in user's local timezone (detected from browser). Don't convert to UTC for display. Daily logs are keyed by local date (YYYY-MM-DD format).

**Q21: What happens if the OpenAI API call fails?**
- **Default Answer**: Show a fallback message: "We're having trouble generating your insight right now. Your data has been saved, and we'll generate your insight shortly." Store log entry, retry API call via a background job or on next page load.

**Q22: Should we cache AI-generated insights?**
- **Default Answer**: Yes. Once an insight is generated for a specific daily log, store it in the `insights` table and never regenerate (unless user manually edits that day's log). This saves API costs and ensures consistency.

**Q23: How do we calculate "baseline" values for rules (like baseline sodium)?**
- **Default Answer**: For MVP, sodium is not a tracked input (it's in the advanced list). Skip Cluster 1's sodium rule for MVP. For other baselines (like maintenance calories), use a simple formula: weight × 12-14 for sedentary estimation. Allow manual override in settings post-MVP.

**Q24: What happens if a user logs multiple times in the same day?**
- **Default Answer**: Overwrite the previous entry for that date. Show a warning: "You already logged today. Submitting will replace your previous entry." No history of edits for MVP.

---

### Content & Tone

**Q25: How technical should the AI insights be?**
- **Default Answer**: Write at an 8th-grade reading level. Use simple terms ("water retention" not "interstitial fluid accumulation"). Avoid medical jargon. Prioritize clarity and reassurance over precision.

**Q26: Should insights ever tell users to see a doctor?**
- **Default Answer**: Yes, include a safety trigger. If weight increases >5 lbs in one day OR calories <500 for 3+ consecutive days, AI should suggest: "These patterns are outside typical ranges. Consider checking in with your healthcare provider." Add disclaimer in footer: "HelioIQ is not medical advice."

**Q27: What's the tone for insights when weight goes up?**
- **Default Answer**: Reassuring, never judgmental. Example: "Today's increase is likely [specific cause]. This is normal and temporary. Your weekly trend shows you're still on track." Always end with actionable encouragement.

---

### Features & Scope

**Q28: Should users be able to add notes to daily logs?**
- **Default Answer**: No for MVP. Adding a notes field creates expectation that AI will read it, which complicates the prompt engineering. Defer to post-MVP.

**Q29: Do we need a mobile-responsive design?**
- **Default Answer**: Yes, absolutely. Many users will log on mobile (likely in the morning after weighing). Design mobile-first, ensure forms and charts work well on iOS/Android browsers. No native app, but PWA-ready (add to home screen capability).

**Q30: Should there be a "streak" or gamification element?**
- **Default Answer**: No streaks for MVP. GLP-1 users often face guilt/pressure around weight, so avoid adding stress. Focus on "progress, not perfection" messaging. Defer gamification to post-MVP if data shows users want it.

---

## Next Steps

1. Set up development environment
2. Initialize Next.js project with dependencies
3. Configure Supabase project and schema
4. Build authentication flow
5. Create daily log form (first functional feature)
