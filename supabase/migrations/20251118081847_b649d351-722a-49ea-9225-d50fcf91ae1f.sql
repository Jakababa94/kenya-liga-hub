-- Create match status enum
CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'completed', 'postponed', 'cancelled');

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  home_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status match_status NOT NULL DEFAULT 'scheduled',
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  venue TEXT,
  round TEXT,
  match_group TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_teams CHECK (home_team_id != away_team_id)
);

-- Create standings table
CREATE TABLE public.standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, team_id)
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches
CREATE POLICY "Anyone can view matches"
  ON public.matches FOR SELECT
  USING (true);

CREATE POLICY "Organizers can manage matches for their tournaments"
  ON public.matches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments
      WHERE tournaments.id = matches.tournament_id
      AND tournaments.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage all matches"
  ON public.matches FOR ALL
  USING (has_role(auth.uid(), 'super_admin'));

-- RLS Policies for standings
CREATE POLICY "Anyone can view standings"
  ON public.standings FOR SELECT
  USING (true);

CREATE POLICY "Organizers can manage standings for their tournaments"
  ON public.standings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments
      WHERE tournaments.id = standings.tournament_id
      AND tournaments.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage all standings"
  ON public.standings FOR ALL
  USING (has_role(auth.uid(), 'super_admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_standings_updated_at
  BEFORE UPDATE ON public.standings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.standings;