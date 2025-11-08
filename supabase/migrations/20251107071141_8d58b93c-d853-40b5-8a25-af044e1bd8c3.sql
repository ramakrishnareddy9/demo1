-- Create team_registrations table for team sports
CREATE TABLE public.team_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id text NOT NULL UNIQUE,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  team_title text NOT NULL,
  college_name text NOT NULL,
  leader_mahostav_id text NOT NULL,
  leader_name text NOT NULL,
  leader_phone text NOT NULL,
  leader_email text NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create team_members table to track individual players
CREATE TABLE public.team_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_registration_id uuid NOT NULL REFERENCES public.team_registrations(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  college_id text,
  contact text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_registrations
CREATE POLICY "Users can view all team registrations"
  ON public.team_registrations
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create team registrations"
  ON public.team_registrations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own team registrations"
  ON public.team_registrations
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for team_members
CREATE POLICY "Users can view team members"
  ON public.team_members
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create team members"
  ON public.team_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_registrations
      WHERE id = team_registration_id
      AND user_id = auth.uid()
    )
  );

-- Function to generate unique team ID
CREATE OR REPLACE FUNCTION public.generate_team_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  new_id TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(team_id FROM 3) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.team_registrations
  WHERE team_id LIKE 'TM%';
  
  new_id := 'TM' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN new_id;
END;
$$;