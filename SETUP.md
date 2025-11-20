# HelioIQ - Setup Guide

This guide will help you set up and run the HelioIQ PWA locally.

## Prerequisites

- Node.js 18+ and npm
- A Supabase account ([signup here](https://supabase.com))
- An OpenAI API key ([get one here](https://platform.openai.com/api-keys))

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [Supabase](https://app.supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Go to SQL Editor and run the schema from `lib/supabase/schema.sql`

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of lib/supabase/schema.sql
```

This will create:
- `user_profiles` table
- `daily_logs` table
- `insights` table
- Row Level Security (RLS) policies
- Indexes for performance

## Testing the App

1. **Sign Up**: Create a new account at `/auth?mode=signup`
2. **Onboarding**: Complete the medication profile
3. **Log Data**: Add your first daily log at `/log`
4. **View Dashboard**: Check your dashboard at `/dashboard`
5. **See Trends**: View your trends at `/trends` (after logging multiple days)

## PWA Installation

The app works as a Progressive Web App. To install:

### On Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Or go to Settings → Install HelioIQ

### On Mobile (iOS)
1. Open in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

### On Mobile (Android)
1. Open in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

### Environment Variables in Production

Make sure to add all environment variables from `.env.example` to your production environment.

## Features Checklist

- ✅ Landing page with product information
- ✅ Email/password authentication
- ✅ User onboarding flow
- ✅ Daily metric logging (8 inputs)
- ✅ Rule engine for pattern detection
- ✅ OpenAI GPT-4 integration for insights
- ✅ Dashboard with today's weight and insight
- ✅ Trends page with 30-day chart
- ✅ Settings page with profile management
- ✅ PWA support with offline capability
- ✅ Dark mode native design
- ✅ Mobile-responsive UI

## Architecture Overview

```
┌─────────────────┐
│   User Input    │
│  (8 metrics)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Daily Log      │
│  (Supabase)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Rule Engine    │
│  (lib/rules.js) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OpenAI GPT-4   │
│  API Call       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Insight        │
│  (Cached)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Display to     │
│  User           │
└─────────────────┘
```

## File Structure

```
helioiq/
├── app/                      # Next.js app router
│   ├── page.js              # Landing page
│   ├── layout.js            # Root layout
│   ├── globals.css          # Global styles
│   ├── auth/                # Authentication
│   ├── onboarding/          # Onboarding flow
│   ├── dashboard/           # Main dashboard
│   ├── log/                 # Daily logging
│   ├── trends/              # Trends & charts
│   ├── settings/            # User settings
│   └── api/
│       └── insights/        # AI insight generation
├── components/              # React components
│   └── PWAInstaller.js      # Service worker registration
├── lib/                     # Utilities
│   ├── supabase.js          # Supabase client
│   ├── rules.js             # Rule engine
│   └── supabase/
│       └── schema.sql       # Database schema
├── public/                  # Static files
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service worker
│   └── icons/               # App icons
├── specs/                   # Product specifications
├── CLAUDE.md                # Development context
├── README.md                # Product overview
└── SETUP.md                 # This file
```

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure you've created a `.env` file with all required variables
- Restart the dev server after adding environment variables

### "Failed to generate insight"
- Check that your OpenAI API key is valid
- Ensure you have credits in your OpenAI account
- Check the browser console for detailed errors

### Database errors
- Verify you've run the schema.sql in Supabase
- Check that RLS policies are enabled
- Ensure your service role key is correct

### PWA not installing
- Make sure you're using HTTPS in production
- Check that manifest.json is accessible
- Verify service worker is registered (check browser console)

## Development Tips

1. **No TypeScript**: This project uses JavaScript only per specs
2. **Dark Mode**: All UI is designed for dark mode by default
3. **Mobile-First**: Design and test for mobile screens first
4. **Minimal UI**: Keep interfaces clean and focused per design system
5. **8-Metric Form**: Never add extra fields beyond the 8 required metrics

## Support

For issues or questions:
- Check the [specs/PROJECT.md](specs/PROJECT.md) for detailed requirements
- Review [CLAUDE.md](CLAUDE.md) for development context
- Open an issue on GitHub (if applicable)

## License

Proprietary - All rights reserved
