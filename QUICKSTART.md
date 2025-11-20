# HelioIQ - Quick Start Guide

Get HelioIQ running in 5 minutes!

## Step 1: Install Dependencies ✅

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [Supabase](https://app.supabase.com) and create a new project
2. Wait for the project to finish setting up (takes ~2 minutes)
3. Go to **Project Settings** > **API**
4. Copy these values:
   - Project URL
   - `anon` public key
   - `service_role` secret key

5. Go to **SQL Editor** in Supabase
6. Click **New Query**
7. Copy and paste the entire contents of `lib/supabase/schema.sql`
8. Click **Run** to create the database tables

## Step 3: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Copy the key (starts with `sk-`)
4. **Important**: Add credits to your OpenAI account if you haven't already

## Step 4: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   OPENAI_API_KEY=sk-your-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Test It Out

1. **Sign up** for a new account
2. **Complete onboarding** with your GLP-1 info
3. **Log your first day** with all 8 metrics
4. **Log a second day** to see your first AI insight!

## What You Should See

### First Login
- You'll be redirected to onboarding
- Fill in 4 simple fields about your medication
- Takes less than 60 seconds

### First Log
- Clean form with 8 metric inputs
- Grouped by category (Nutrition, Activity, Recovery)
- Shows yesterday's values for reference

### Dashboard
- Hero display of today's weight
- AI-generated insight card (after day 2+)
- Clean, minimal design

### Trends Page
- 30-day weight chart
- Stats cards showing progress
- Past insights list

## Troubleshooting

### "Missing environment variables"
- Make sure `.env` file exists in root directory
- Restart dev server after creating `.env`
- Check all values are on one line (no line breaks)

### "Failed to generate insight"
- Verify OpenAI API key is correct
- Check you have credits in OpenAI account
- Look at terminal for detailed error messages

### Database errors
- Make sure you ran `schema.sql` in Supabase
- Check your service role key is correct
- Verify RLS policies were created

### App not loading
- Make sure port 3000 is not in use
- Try `npm run dev -- --port 3001`
- Check terminal for build errors

## Next Steps

1. **Add app icons** - Place PNG icons in `public/icons/` (see README there)
2. **Customize branding** - Update colors in `tailwind.config.js`
3. **Deploy to Vercel** - Push to GitHub and import to Vercel
4. **Test PWA** - Install app on your phone's home screen

## Key Files to Know

- `app/page.js` - Landing page
- `app/dashboard/page.js` - Main dashboard
- `app/log/page.js` - Daily logging form
- `lib/rules.js` - Rule engine logic
- `app/api/insights/generate/route.js` - AI insight generation
- `lib/supabase/schema.sql` - Database schema

## Need Help?

- Read [SETUP.md](SETUP.md) for detailed documentation
- Check [CLAUDE.md](CLAUDE.md) for development context
- Review [specs/PROJECT.md](specs/PROJECT.md) for full specifications

---

**You're all set!** Start logging your GLP-1 journey 🚀
