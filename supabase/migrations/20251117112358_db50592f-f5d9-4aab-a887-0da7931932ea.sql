-- Create enum for team member roles
CREATE TYPE public.team_member_role AS ENUM ('captain', 'member');

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, tournament_id)
);

-- Create team_members table for roster management
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role team_member_role NOT NULL DEFAULT 'member',
  jersey_number INTEGER,
  position TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams table

-- Anyone can view teams
CREATE POLICY "Anyone can view teams"
ON public.teams
FOR SELECT
USING (true);

-- Authenticated users can create teams
CREATE POLICY "Authenticated users can create teams"
ON public.teams
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = captain_id);

-- Captains can update their own teams
CREATE POLICY "Captains can update their own teams"
ON public.teams
FOR UPDATE
TO authenticated
USING (auth.uid() = captain_id)
WITH CHECK (auth.uid() = captain_id);

-- Captains can delete their own teams
CREATE POLICY "Captains can delete their own teams"
ON public.teams
FOR DELETE
TO authenticated
USING (auth.uid() = captain_id);

-- RLS Policies for team_members table

-- Anyone can view team members
CREATE POLICY "Anyone can view team members"
ON public.team_members
FOR SELECT
USING (true);

-- Team captains can add members to their teams
CREATE POLICY "Team captains can add members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE id = team_id AND captain_id = auth.uid()
  )
);

-- Team captains can update members in their teams
CREATE POLICY "Team captains can update members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE id = team_id AND captain_id = auth.uid()
  )
);

-- Team captains can remove members from their teams
CREATE POLICY "Team captains can remove members"
ON public.team_members
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE id = team_id AND captain_id = auth.uid()
  )
);

-- Create trigger for updating teams updated_at
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_teams_captain_id ON public.teams(captain_id);
CREATE INDEX idx_teams_tournament_id ON public.teams(tournament_id);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);