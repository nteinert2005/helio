# HelioIQ

**Your GLP-1 Daily Insight Companion**

HelioIQ helps users on GLP-1 medications (semaglutide, tirzepatide) understand daily weight fluctuations through AI-powered insights. Stop stressing about the scale — get calm, scientific explanations instead.

---

## What Problem Does HelioIQ Solve?

If you're on a GLP-1 medication like Ozempic, Wegovy, Mounjaro, or Zepbound, you know the daily weigh-in anxiety:

- "Why didn't I lose weight today?"
- "Did I do something wrong?"
- "Is the medication still working?"

**HelioIQ answers these questions** by analyzing your daily metrics and explaining the real reasons behind weight fluctuations — water retention, cortisol, digestion, medication timing, and more.

---

## How It Works

### 1. Log Your Daily Metrics (Takes <2 minutes)
Track 8 simple inputs each day:
- Daily weight
- Calories (rough estimate is fine)
- Protein intake
- Steps
- Water intake
- Sleep hours
- Medication taken (yes/no)
- Bowel movements (none/normal/constipated)

### 2. Get AI-Powered Insights
Our system analyzes your data using:
- **Rule Engine**: Detects patterns in water retention, GLP-1 effects, digestion, nutrition, and measurement consistency
- **AI Reasoner**: GPT-4 interprets the patterns and tells your story in plain language

### 3. See Your Personalized Explanation
Every day you get three sections:
- **Reason for today's number**: Why your weight changed (or didn't)
- **Trend interpretation**: What your weekly/monthly pattern shows
- **Today's focus**: Actionable steps to support your progress

---

## Example Insight

**Your Input:**
- Weight: +0.4 lbs
- Protein: 45g (below target)
- Sleep: 5 hours
- Steps: 2,300
- Water: Low
- Bowel movement: None
- Week 1 on medication

**HelioIQ's Insight:**

> **Reason for today's number:**
> "Today's slight increase is from a combination of low sleep, minimal movement, and lack of a bowel movement — all of which create temporary water retention. This is not fat gain."
>
> **Trend interpretation:**
> "You are in the expected week-1 GLP-1 pattern where weight loss comes in drops rather than daily losses. Nothing in your data suggests lack of progress."
>
> **Today's focus:**
> "Drink 2 more bottles of water, aim for 6+ hours of sleep, and try a short walk. This will help your body flush retained water."

---

## Key Features (MVP)

- **Daily Metric Logging**: Simple form with 8 inputs
- **AI-Powered Insights**: Personalized explanations based on your unique data
- **Weight Trend Charts**: Visualize your 7-day and 30-day patterns
- **Dark Mode Native**: Designed for late-night logging
- **Mobile-Friendly**: Log from your phone right after weighing in
- **Privacy-Focused**: Your data stays secure and is never shared

---

## Who Is This For?

HelioIQ is built specifically for:
- Anyone on GLP-1 medications (semaglutide, tirzepatide, etc.)
- People who want to understand their weight loss journey better
- Users who need reassurance and science-backed explanations
- Those tired of generic fitness apps that don't understand GLP-1 physiology

---

## Tech Stack

- **Frontend**: Next.js, TailwindCSS
- **Database**: Supabase
- **AI**: OpenAI GPT-4
- **Hosting**: Vercel
- **Design**: Dark mode optimized, mobile-first

---

## Product Roadmap

### Current: MVP (Phase 1)
**Niche: GLP-1 Daily Insight Companion**
- Daily logging (8 inputs)
- AI-powered insights
- Weight trend visualization
- Rule-based pattern detection

### Future Phases (Post-MVP)

**Phase 2: GLP-1 Optimization Engine**
- Advanced inputs (sodium, carbs, stress, cycle phase)
- Multi-week pattern analysis
- Predictive modeling
- Side effect tracking

**Phase 3: GLP-1 Intelligence as a Service**
- API for telehealth clinics
- Integration with coaching apps
- Wearable/scale integrations
- Corporate wellness programs

**Phase 4: GLP-1 OS**
- Pre-GLP decision support
- Dose optimization
- Long-term metabolic forecasting
- Complete ecosystem integration

See [specs/THOUGHTS.md](specs/THOUGHTS.md) for full vision.

---

## Key Differentiators

1. **GLP-1 Specific**: Not a generic weight loss app — built exclusively for semaglutide/tirzepatide users
2. **Context-Aware AI**: Explains *why* based on actual physiological patterns, not just tracking numbers
3. **Reassurance-First**: Reduces anxiety, provides calm scientific explanations
4. **Simple MVP**: Only 8 inputs, no feature bloat, no overwhelming complexity
5. **Dark Mode Native**: Designed for the real-world use case (morning weigh-ins)

---

## Pricing

- **Beta Launch**: Free for the first 100 users
- **Post-Beta**: $9.99/month subscription
- No free tier (ensures quality and user commitment)

---

## Getting Started

### For Users
1. Sign up at [helioiq.com](https://helioiq.com) (when live)
2. Complete the 60-second onboarding (medication info)
3. Log your first day's metrics
4. Return tomorrow to see your first AI-powered insight

### For Developers
See [CLAUDE.md](CLAUDE.md) for complete development context.

### For Product Owners
See [specs/PROJECT.md](specs/PROJECT.md) for full MVP specification.

---

## Success Metrics

We measure success by:
- **Daily active logging rate** >70%
- **Weekly retention** >80%
- **User satisfaction** (insights rated >4/5)
- **Reduced anxiety** about weight fluctuations (qualitative feedback)
- **Referral rate** >10% (users share with friends)

---

## Privacy & Data

- All data stored securely in Supabase
- No PII sent to OpenAI (only numeric metrics)
- Users can delete their account and all data anytime
- No data sharing with third parties
- Not HIPAA compliant for MVP (future consideration)

**Disclaimer**: HelioIQ is not medical advice. Always consult your healthcare provider for medical decisions.

---

## Contact & Support

- **Issues/Bugs**: [Create an issue](https://github.com/yourusername/helioiq/issues)
- **Feedback**: feedback@helioiq.com
- **General Inquiries**: hello@helioiq.com

---

## Target Launch

**8 weeks from development start**
- Weeks 1-2: Foundation (Next.js, Supabase, Auth)
- Weeks 3-4: Core features (logging, rule engine, AI integration)
- Weeks 5-6: UI/UX polish (dark mode, charts, responsive design)
- Weeks 7-8: Testing & deployment

---

## Community

Join the conversation:
- Reddit: r/Ozempic, r/Mounjaro, r/Semaglutide
- Facebook: GLP-1 weight loss support groups
- Discord: [Coming soon]

---

## License

Proprietary (for now)

---

## Acknowledgments

Built for the GLP-1 community who deserve better tools to understand their journey.

Inspired by the insight that weight loss on GLP-1s isn't linear — it's a series of drops, plateaus, and fluctuations that need context, not just a number on a scale.

---

**Last Updated**: 2025-11-17
