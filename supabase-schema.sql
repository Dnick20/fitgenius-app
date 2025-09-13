-- FitGenius Supabase Schema
-- Copy and paste this into Supabase SQL Editor

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-super-secret-jwt-key-change-in-production-minimum-256-bits';

-- Users table (Supabase auth handles this, but we need our profile extension)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  profile JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress entries
CREATE TABLE IF NOT EXISTS public.progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2),
  body_fat DECIMAL(4,2),
  waist DECIMAL(4,2),
  neck DECIMAL(4,2),
  hip DECIMAL(4,2),
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  difficulty TEXT,
  duration TEXT,
  calories INTEGER,
  exercises JSONB DEFAULT '[]',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meals
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ingredients JSONB DEFAULT '[]',
  nutrition JSONB DEFAULT '{}',
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  category TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly meal plans
CREATE TABLE IF NOT EXISTS public.weekly_meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  repetition_index INTEGER DEFAULT 1,
  repetition_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User workout sessions
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  calories_burned INTEGER,
  notes TEXT,
  exercises_completed JSONB DEFAULT '[]'
);

-- Grocery lists
CREATE TABLE IF NOT EXISTS public.grocery_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Weekly Grocery List',
  items JSONB DEFAULT '[]',
  checked_items JSONB DEFAULT '[]',
  people_count INTEGER DEFAULT 1,
  store_preference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_progress_entries_user_id ON public.progress_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_entries_date ON public.progress_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_type ON public.meals(meal_type);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_id ON public.weekly_meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_grocery_lists_user_id ON public.grocery_lists(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grocery_lists ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own progress" ON public.progress_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workouts" ON public.workouts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own meals" ON public.meals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own meal plans" ON public.weekly_meal_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workout sessions" ON public.workout_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own grocery lists" ON public.grocery_lists
  FOR ALL USING (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grocery_lists_updated_at BEFORE UPDATE ON public.grocery_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.user_profiles (id, email, profile) 
SELECT 
  gen_random_uuid(),
  'demo@fitgenius.com',
  '{"name": "Demo User", "age": 28, "gender": "male", "height": 175, "weight": 75, "heightFeet": 5, "heightInches": 9, "weightLbs": 165, "goalWeightLbs": 155, "activityLevel": "moderate", "goal": "lose_weight", "workoutTypes": ["hiit", "running"], "is75Hard": false}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE email = 'demo@fitgenius.com');