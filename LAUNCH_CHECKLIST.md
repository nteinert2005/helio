# HelioIQ - Launch Checklist

Use this checklist to ensure everything is ready before launching.

## 🔧 Development Setup

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`
- [ ] All environment variables filled in
- [ ] Supabase project created
- [ ] Database schema applied (`schema.sql`)
- [ ] OpenAI API key configured with credits
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] No console errors on page load

## 🎨 Design & Assets

- [ ] App icons created (all 8 sizes in `public/icons/`)
- [ ] Icons look good at small sizes (72x72)
- [ ] Favicon added
- [ ] Logo/branding finalized
- [x] Color palette matches brand
- [x] Dark mode tested
- [ ] Mobile responsive on all pages
- [x] Animations are smooth (60fps)

## 🧪 Testing

### Authentication Flow
- [ ] Can sign up with email/password
- [ ] Can log in with existing account
- [ ] Can log out successfully
- [ ] Invalid credentials show error
- [ ] Duplicate email shows error
- [ ] Session persists across page refresh

### Onboarding Flow
- [ ] Redirects to onboarding after signup
- [ ] All 4 fields required
- [ ] Can select medication type
- [ ] Date picker works
- [ ] Saves to database correctly
- [ ] Redirects to log page after completion
- [ ] Doesn't show onboarding if already completed

### Daily Logging
- [x] All 8 fields required
- [x] Decimal values accepted for weight/sleep
- [ ] Shows yesterday's values
- [x] Can submit first log
- [x] Can update same day's log
- [x] Saves to database correctly
- [x] Redirects to dashboard after save

### Dashboard
- [ ] Shows today's weight correctly
- [ ] Shows weight change from yesterday
- [ ] Shows insight after day 2+
- [ ] Shows "No data" state on first visit
- [ ] Shows "First day" message after day 1
- [x] Navigation works to all pages
- [ ] Can sign out

### AI Insights
- [ ] Generated after second day of logging
- [ ] Contains all 3 sections (reason, trend, focus)
- [ ] Tone is reassuring and non-judgmental
- [ ] Reading level is appropriate
- [ ] Cached properly (doesn't regenerate on refresh)
- [ ] Shows fallback if AI fails

### Trends Page
- [x] Chart displays correctly
- [ ] Stats cards show accurate data
- [ ] Past insights load
- [ ] Empty state shows when no data
- [x] Chart is responsive on mobile

### Settings Page
- [ ] Shows current profile correctly
- [ ] Can edit medication info
- [ ] Changes save to database
- [ ] Can cancel editing
- [ ] Account deletion works (test with dummy account)
- [ ] Legal links navigate correctly

## 🔒 Security

- [ ] RLS policies tested (can't access other user's data)
- [ ] API keys not exposed in frontend
- [ ] No SQL injection vulnerabilities
- [ ] XSS prevention verified
- [ ] HTTPS enforced in production
- [ ] Service role key kept secret
- [ ] Auth session timeout works
- [ ] Password requirements enforced (min 6 chars)

## 📱 PWA Features

- [ ] Manifest.json loads correctly
- [ ] Service worker registers
- [ ] App installable on Chrome desktop
- [ ] App installable on iOS Safari
- [ ] App installable on Android Chrome
- [ ] Offline mode works (shows cached pages)
- [ ] Icons appear correctly when installed
- [ ] App shortcuts work
- [x] Theme color matches design
- [ ] Splash screen looks good

## 🚀 Performance

- [ ] Lighthouse score > 90 (all metrics)
- [ ] Images optimized
- [ ] No unnecessary re-renders
- [ ] Database queries optimized
- [ ] API response times < 2 seconds
- [ ] Page load time < 3 seconds
- [ ] No memory leaks
- [ ] Bundle size reasonable

## 📊 Database

- [ ] All tables created
- [ ] RLS policies enabled and tested
- [ ] Indexes created
- [ ] Backup strategy in place
- [ ] Migration plan documented
- [ ] Connection pooling configured (if needed)

## 🌐 Deployment

- [ ] Vercel project created
- [ ] GitHub repo connected
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Build succeeds without errors
- [ ] Production URLs work
- [ ] Redirects configured correctly
- [ ] Error pages customized

## 📝 Content

- [ ] Privacy policy page created
- [ ] Terms of service page created
- [ ] Legal copy reviewed (by lawyer if needed)
- [ ] Landing page copy finalized
- [ ] All placeholder text removed
- [x] Spelling/grammar checked
- [ ] Brand voice consistent

## 🐛 Edge Cases

- [ ] First-time user experience tested
- [ ] Missing data states handled
- [ ] API failure states handled
- [ ] Network offline scenarios tested
- [ ] Long text in insight cards tested
- [ ] Very high/low numbers in forms tested
- [ ] Concurrent edits handled
- [ ] Old browser support verified (if needed)

## 📈 Analytics & Monitoring

- [ ] Error tracking set up (Sentry, etc.)
- [ ] Analytics configured (if desired)
- [ ] OpenAI usage monitoring in place
- [ ] Database usage monitoring
- [ ] Cost alerts configured
- [ ] Uptime monitoring active

## 📧 Email (Future - Optional for MVP)

- [ ] Resend API configured (if using)
- [ ] Email templates created
- [ ] Transactional emails tested
- [ ] Unsubscribe links work
- [ ] Email deliverability verified

## 🎓 Documentation

- [ ] README.md updated
- [ ] SETUP.md accurate
- [ ] QUICKSTART.md tested
- [ ] API documentation written (if external API)
- [ ] Comments added to complex code
- [ ] Environment variables documented

## 👥 User Testing

- [ ] Beta testers recruited
- [ ] Feedback form created
- [ ] At least 5 people tested full flow
- [ ] Critical bugs fixed
- [ ] UX improvements implemented
- [ ] Testimonials collected (if desired)

## 📱 App Store (If Applicable)

- [ ] PWA meets App Store guidelines
- [ ] Screenshots prepared
- [ ] App description written
- [ ] Keywords researched
- [ ] Privacy manifest created
- [ ] App submitted for review

## 🎯 Launch Day

- [ ] Final production build tested
- [ ] All team members notified
- [ ] Support email/system ready
- [ ] Social media posts scheduled
- [ ] Press release ready (if applicable)
- [ ] Monitoring dashboard open
- [ ] Rollback plan documented
- [ ] Celebration planned! 🎉

## Post-Launch (Week 1)

- [ ] Monitor error rates daily
- [ ] Review user feedback
- [ ] Check API usage/costs
- [ ] Fix critical bugs ASAP
- [ ] Respond to user questions
- [ ] Track key metrics (signups, retention, etc.)
- [ ] Thank beta testers

---

## Quick Pre-Launch Commands

```bash
# Run all checks
npm run build          # Ensure production build works
npm run lint           # Check for code issues

# Test database
# (Run test queries in Supabase dashboard)

# Performance audit
# (Run Lighthouse in Chrome DevTools)

# Security scan
npm audit              # Check for vulnerable dependencies
```

## Launch-Blocking Issues

These MUST be fixed before launch:

- ⚠️ **Critical Security Vulnerability**
- ⚠️ **Data Loss Bug**
- ⚠️ **Authentication Not Working**
- ⚠️ **App Crashes on Core Flow**
- ⚠️ **No Way to Contact Support**
- ⚠️ **Legal Pages Missing**

## Launch-Ready Criteria

You can launch when:

✅ All "Development Setup" items complete
✅ All "Testing" core flows work
✅ All "Security" items verified
✅ All "PWA Features" working on target devices
✅ "Deployment" successful
✅ No launch-blocking issues

---

**Good luck with your launch! 🚀**
