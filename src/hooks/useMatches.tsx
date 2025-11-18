import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';

export interface Match {
  id: string;
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;
  scheduled_at: string;
  status: MatchStatus;
  home_score: number;
  away_score: number;
  venue: string | null;
  round: string | null;
  match_group: string | null;
  created_at: string;
  updated_at: string;
  home_team?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  away_team?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

export function useMatches(tournamentId: string) {
  const query = useQuery({
    queryKey: ['matches', tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name, logo_url),
          away_team:teams!matches_away_team_id_fkey(id, name, logo_url)
        `)
        .eq('tournament_id', tournamentId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data as Match[];
    },
    enabled: !!tournamentId,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!tournamentId) return;

    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId, query]);

  return query;
}
