import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface Standing {
  id: string;
  tournament_id: string;
  team_id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  created_at: string;
  updated_at: string;
  team?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

export function useStandings(tournamentId: string) {
  const query = useQuery({
    queryKey: ['standings', tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('standings')
        .select(`
          *,
          team:teams(id, name, logo_url)
        `)
        .eq('tournament_id', tournamentId)
        .order('points', { ascending: false })
        .order('goal_difference', { ascending: false })
        .order('goals_for', { ascending: false });

      if (error) throw error;
      return data as Standing[];
    },
    enabled: !!tournamentId,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!tournamentId) return;

    const channel = supabase
      .channel('standings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'standings',
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
