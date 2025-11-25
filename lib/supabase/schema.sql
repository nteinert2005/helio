-- HelioIQ Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table is managed by Supabase Auth automatically

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  glp1_medication TEXT NOT NULL CHECK (glp1_medication IN ('semaglutide', 'tirzepatide', 'other')),
  start_date DATE NOT NULL,
  current_dosage TEXT NOT NULL,
  dosing_schedule TEXT NOT NULL CHECK (dosing_schedule IN ('weekly', 'daily', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Logs Table
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  weight DECIMAL(5, 2) NOT NULL CHECK (weight > 0),
  calories INTEGER NOT NULL CHECK (calories >= 0),
  protein INTEGER NOT NULL CHECK (protein >= 0),
  steps INTEGER NOT NULL CHECK (steps >= 0),
  water INTEGER NOT NULL CHECK (water >= 0),
  sleep_hours DECIMAL(3, 1) NOT NULL CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  medication_taken BOOLEAN NOT NULL DEFAULT false,
  bowel_movement TEXT NOT NULL CHECK (bowel_movement IN ('none', 'normal', 'constipated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- Insights Table
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  trend_interpretation TEXT NOT NULL,
  focus_today TEXT NOT NULL,
  triggered_rules JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, log_date DESC);
CREATE INDEX idx_insights_daily_log ON insights(daily_log_id);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Daily Logs Policies
CREATE POLICY "Users can view their own logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON daily_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON daily_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Insights Policies
CREATE POLICY "Users can view their own insights"
  ON insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = insights.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Service can insert insights"
  ON insights FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can update insights"
  ON insights FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
