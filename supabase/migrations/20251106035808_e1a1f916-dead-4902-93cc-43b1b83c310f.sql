-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('university', 'outside')),
  university_roll_no TEXT,
  college_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sports', 'cultural')),
  description TEXT NOT NULL,
  rules TEXT,
  team_size TEXT,
  fees TEXT,
  date_time TEXT,
  venue TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events policies (readable by all authenticated users)
CREATE POLICY "Events are viewable by authenticated users"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

-- Create registrations table
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS for registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Registrations policies
CREATE POLICY "Users can view own registrations"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations"
  ON public.registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own registrations"
  ON public.registrations FOR DELETE
  USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'university')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();