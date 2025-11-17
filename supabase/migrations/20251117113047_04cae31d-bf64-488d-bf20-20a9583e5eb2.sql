-- Create enum for registration status
CREATE TYPE public.registration_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');

-- Create tournament_registrations table
CREATE TABLE public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  status registration_status NOT NULL DEFAULT 'pending',
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  UNIQUE(tournament_id, team_id)
);

-- Enable RLS
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tournament_registrations

-- Anyone can view approved registrations
CREATE POLICY "Anyone can view approved registrations"
ON public.tournament_registrations
FOR SELECT
USING (status = 'approved');

-- Team captains can view their own team registrations
CREATE POLICY "Team captains can view their registrations"
ON public.tournament_registrations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_id AND teams.captain_id = auth.uid()
  )
);

-- Tournament organizers can view registrations for their tournaments
CREATE POLICY "Organizers can view registrations for their tournaments"
ON public.tournament_registrations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tournaments
    WHERE tournaments.id = tournament_id AND tournaments.organizer_id = auth.uid()
  )
);

-- Team captains can register their teams
CREATE POLICY "Team captains can register their teams"
ON public.tournament_registrations
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_id AND teams.captain_id = auth.uid()
  )
);

-- Team captains can withdraw their registrations
CREATE POLICY "Team captains can withdraw registrations"
ON public.tournament_registrations
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_id AND teams.captain_id = auth.uid()
  ) AND status = 'pending'
)
WITH CHECK (status = 'withdrawn');

-- Tournament organizers can update registrations for their tournaments
CREATE POLICY "Organizers can update registrations"
ON public.tournament_registrations
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tournaments
    WHERE tournaments.id = tournament_id AND tournaments.organizer_id = auth.uid()
  )
);

-- Super admins can manage all registrations
CREATE POLICY "Super admins can manage all registrations"
ON public.tournament_registrations
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- Create indexes for better performance
CREATE INDEX idx_tournament_registrations_tournament_id ON public.tournament_registrations(tournament_id);
CREATE INDEX idx_tournament_registrations_team_id ON public.tournament_registrations(team_id);
CREATE INDEX idx_tournament_registrations_status ON public.tournament_registrations(status);