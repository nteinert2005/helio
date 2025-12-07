# Helio Changelog

All notable changes to this project will be documented in this file.

The format is based on the versioning principles defined in VERSIONING.md.

---

## [0.2.0] - 2025-01-06

### Added
- Brevo email integration for waitlist management
- Comprehensive stability score algorithm with weighted factors
- Volatility scoring for weight, sleep, hydration, protein, medication, and symptoms
- Statistical analysis helpers (average, standard deviation)
- Mock insight data for testing three sections in development mode
- Spam check reminder for waitlist signups
- Development testing interface for insight generation

### Changed
- Updated landing page layout with auth buttons in header (dev mode only)
- Moved phone mockup demo below hero section
- Centered hero content for better visual hierarchy
- Updated mock insight data to Madison-inspired brand voice
- Applied brand voice principles: confident minimalism, quiet intensity, confessional clarity

### Fixed
- App logo icon alignment and sizing

### Technical
- Graceful fallback if Brevo API fails - user still saved to Supabase
- Added BREVO_API_KEY and BREVO_LIST_ID environment variables
- Uses Brevo v3 contacts endpoint with list assignment

---

## [0.1.0] - 2025-01-05

### Added
- Initial release
- Core tracking functionality
- Daily logging system
- Supabase authentication
- Landing page with waitlist
- User onboarding flow
- Basic dashboard
- Insights page structure
- Trends visualization
- Settings management

### Infrastructure
- Next.js 14 application setup
- Supabase integration
- TailwindCSS dark mode design system
- Vercel deployment configuration

---

## Version Format

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Foundational shifts (0.x.x = pre-launch)
- **MINOR**: Meaningful capability growth
- **PATCH**: Stability and precision improvements

See VERSIONING.md for complete versioning guidelines.
