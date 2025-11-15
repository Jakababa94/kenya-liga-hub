-- Create enum for tournament status
CREATE TYPE public.tournament_status AS ENUM (
  'draft',
  'published',
  'registration_open',
  'registration_closed',
  'ongoing',
  'completed',
  'cancelled'
);

-- Create enum for tournament categories
CREATE TYPE public.tournament_category AS ENUM (
  'u17',
  'u21',
  'open',
  'veterans',
  'womens'
);

-- Create enum for Kenyan regions
CREATE TYPE public.kenya_region AS ENUM (
  'nairobi',
  'central',
  'coast',
  'eastern',
  'north_eastern',
  'nyanza',
  'rift_valley',
  'western'
);

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  region kenya_region NOT NULL,
  venue TEXT NOT NULL,
  category tournament_category NOT NULL,
  status tournament_status DEFAULT 'draft' NOT NULL,
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  registration_deadline DATE NOT NULL,
  
  -- Financial
  entry_fee NUMERIC(10, 2) NOT NULL CHECK (entry_fee >= 0),
  currency TEXT DEFAULT 'KES' NOT NULL,
  
  -- Team limits
  max_teams INTEGER NOT NULL CHECK (max_teams > 0),
  min_teams INTEGER DEFAULT 4 CHECK (min_teams > 0),
  
  -- Team composition rules
  min_players_per_team INTEGER DEFAULT 11,
  max_players_per_team INTEGER DEFAULT 20,
  
  -- Organizer
  organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CHECK (end_date >= start_date),
  CHECK (registration_deadline <= start_date),
  CHECK (max_players_per_team >= min_players_per_team)
);

-- Enable RLS
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tournaments

-- Public can view published tournaments
CREATE POLICY "Anyone can view published tournaments"
  ON public.tournaments FOR SELECT
  USING (status IN ('published', 'registration_open', 'registration_closed', 'ongoing', 'completed'));

-- Authenticated users can view all tournaments (including drafts they might apply to)
CREATE POLICY "Authenticated users can view all tournaments"
  ON public.tournaments FOR SELECT
  TO authenticated
  USING (true);

-- Organizers can create tournaments
CREATE POLICY "Organizers can create tournaments"
  ON public.tournaments FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'organizer') OR 
    public.has_role(auth.uid(), 'super_admin')
  );

-- Organizers can update their own tournaments
CREATE POLICY "Organizers can update their own tournaments"
  ON public.tournaments FOR UPDATE
  TO authenticated
  USING (
    organizer_id = auth.uid() OR 
    public.has_role(auth.uid(), 'super_admin')
  )
  WITH CHECK (
    organizer_id = auth.uid() OR 
    public.has_role(auth.uid(), 'super_admin')
  );

-- Organizers can delete their own draft tournaments
CREATE POLICY "Organizers can delete their own draft tournaments"
  ON public.tournaments FOR DELETE
  TO authenticated
  USING (
    (organizer_id = auth.uid() AND status = 'draft') OR 
    public.has_role(auth.uid(), 'super_admin')
  );

-- Create index for common queries
CREATE INDEX idx_tournaments_status ON public.tournaments(status);
CREATE INDEX idx_tournaments_region ON public.tournaments(region);
CREATE INDEX idx_tournaments_category ON public.tournaments(category);
CREATE INDEX idx_tournaments_start_date ON public.tournaments(start_date);
CREATE INDEX idx_tournaments_organizer ON public.tournaments(organizer_id);

-- Trigger for updating updated_at timestamp
CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();