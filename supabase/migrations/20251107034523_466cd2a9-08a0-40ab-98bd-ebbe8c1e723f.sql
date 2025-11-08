-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('university', 'outside');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Migrate existing role data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- Add mahostav_id to profiles
ALTER TABLE public.profiles ADD COLUMN mahostav_id TEXT UNIQUE;

-- Drop role column from profiles (after migrating data)
ALTER TABLE public.profiles DROP COLUMN role;

-- RLS policies for user_roles
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role on signup"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to generate next MAHOSTAV ID
CREATE OR REPLACE FUNCTION public.generate_mahostav_id(_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  next_number INTEGER;
  new_id TEXT;
BEGIN
  -- Get user's role
  SELECT role INTO user_role FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
  
  IF user_role IS NULL THEN
    RAISE EXCEPTION 'User role not found';
  END IF;
  
  -- Check if user already has an ID
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND mahostav_id IS NOT NULL) THEN
    RAISE EXCEPTION 'MAHOSTAV ID already generated';
  END IF;
  
  -- Generate ID based on role
  IF user_role = 'university' THEN
    -- Vignan students: MH000001 to MH200000
    SELECT COALESCE(MAX(CAST(SUBSTRING(mahostav_id FROM 3) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.profiles
    WHERE mahostav_id LIKE 'MH%'
      AND CAST(SUBSTRING(mahostav_id FROM 3) AS INTEGER) BETWEEN 1 AND 200000;
    
    IF next_number > 200000 THEN
      RAISE EXCEPTION 'Vignan student ID limit reached';
    END IF;
    
    new_id := 'MH' || LPAD(next_number::TEXT, 6, '0');
  ELSE
    -- Outside students: MH200001 onwards
    SELECT COALESCE(MAX(CAST(SUBSTRING(mahostav_id FROM 3) AS INTEGER)), 200000) + 1
    INTO next_number
    FROM public.profiles
    WHERE mahostav_id LIKE 'MH%'
      AND CAST(SUBSTRING(mahostav_id FROM 3) AS INTEGER) > 200000;
    
    new_id := 'MH' || LPAD(next_number::TEXT, 6, '0');
  END IF;
  
  -- Update profile with new ID
  UPDATE public.profiles
  SET mahostav_id = new_id
  WHERE id = _user_id;
  
  RETURN new_id;
END;
$$;

-- Update handle_new_user trigger function to use user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, name, email, phone, university_roll_no, college_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'university_roll_no', NULL),
    COALESCE(NEW.raw_user_meta_data->>'college_name', NULL)
  );
  
  -- Insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'university')::app_role
  );
  
  RETURN NEW;
END;
$$;