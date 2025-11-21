-- Create player_statistics table
CREATE TABLE public.player_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0,
  shots_off_target INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  fouls_committed INTEGER DEFAULT 0,
  fouls_suffered INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(match_id, player_id)
);

-- Enable RLS
ALTER TABLE public.player_statistics ENABLE ROW LEVEL SECURITY;

-- Anyone can view player statistics
CREATE POLICY "Anyone can view player statistics"
ON public.player_statistics
FOR SELECT
USING (true);

-- Organizers can manage statistics for their tournament matches
CREATE POLICY "Organizers can manage statistics for their matches"
ON public.player_statistics
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.tournaments t ON t.id = m.tournament_id
    WHERE m.id = player_statistics.match_id
    AND t.organizer_id = auth.uid()
  )
);

-- Super admins can manage all statistics
CREATE POLICY "Super admins can manage all statistics"
ON public.player_statistics
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_player_statistics_updated_at
BEFORE UPDATE ON public.player_statistics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();