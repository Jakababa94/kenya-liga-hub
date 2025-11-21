import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlayerStatistic {
  id: string;
  match_id: string;
  team_id: string;
  player_id: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  shots_on_target: number;
  shots_off_target: number;
  saves: number;
  fouls_committed: number;
  fouls_suffered: number;
  created_at: string;
  updated_at: string;
  player?: {
    id: string;
    full_name: string;
    email: string;
  };
  team?: {
    id: string;
    name: string;
  };
}

export function usePlayerStatistics(matchId: string) {
  return useQuery({
    queryKey: ['player-statistics', matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_statistics')
        .select(`
          *,
          player:profiles(id, full_name, email),
          team:teams(id, name)
        `)
        .eq('match_id', matchId)
        .order('goals', { ascending: false });

      if (error) throw error;
      return data as PlayerStatistic[];
    },
    enabled: !!matchId,
  });
}

export function usePlayerCareerStats(playerId: string) {
  return useQuery({
    queryKey: ['player-career-stats', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_statistics')
        .select('*')
        .eq('player_id', playerId);

      if (error) throw error;

      // Aggregate statistics
      const totalGoals = data.reduce((sum, stat) => sum + (stat.goals || 0), 0);
      const totalAssists = data.reduce((sum, stat) => sum + (stat.assists || 0), 0);
      const totalYellowCards = data.reduce((sum, stat) => sum + (stat.yellow_cards || 0), 0);
      const totalRedCards = data.reduce((sum, stat) => sum + (stat.red_cards || 0), 0);
      const totalMinutes = data.reduce((sum, stat) => sum + (stat.minutes_played || 0), 0);
      const matchesPlayed = data.length;

      return {
        matchesPlayed,
        totalGoals,
        totalAssists,
        totalYellowCards,
        totalRedCards,
        totalMinutes,
        data,
      };
    },
    enabled: !!playerId,
  });
}
