import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  totalTeams: number;
  activeTournaments: number;
}

export const useUserStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get all teams where user is captain or member
      const { data: memberTeams } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      const { data: captainTeams } = await supabase
        .from('teams')
        .select('id')
        .eq('captain_id', user.id);

      const teamIds = [
        ...(memberTeams?.map(t => t.team_id) || []),
        ...(captainTeams?.map(t => t.id) || [])
      ];

      const uniqueTeamIds = [...new Set(teamIds)];

      if (uniqueTeamIds.length === 0) {
        return {
          totalMatches: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsScored: 0,
          goalsConceded: 0,
          totalTeams: 0,
          activeTournaments: 0,
        };
      }

      // Get standings for user's teams
      const { data: standings } = await supabase
        .from('standings')
        .select('*')
        .in('team_id', uniqueTeamIds);

      // Get active tournament registrations
      const { data: registrations } = await supabase
        .from('tournament_registrations')
        .select('tournament:tournaments(status)')
        .in('team_id', uniqueTeamIds)
        .eq('status', 'approved');

      const totalMatches = standings?.reduce((sum, s) => sum + (s.played || 0), 0) || 0;
      const wins = standings?.reduce((sum, s) => sum + (s.won || 0), 0) || 0;
      const draws = standings?.reduce((sum, s) => sum + (s.drawn || 0), 0) || 0;
      const losses = standings?.reduce((sum, s) => sum + (s.lost || 0), 0) || 0;
      const goalsScored = standings?.reduce((sum, s) => sum + (s.goals_for || 0), 0) || 0;
      const goalsConceded = standings?.reduce((sum, s) => sum + (s.goals_against || 0), 0) || 0;

      const activeTournaments = registrations?.filter(
        r => r.tournament && ['ongoing', 'registration_open'].includes(r.tournament.status)
      ).length || 0;

      return {
        totalMatches,
        wins,
        draws,
        losses,
        goalsScored,
        goalsConceded,
        totalTeams: uniqueTeamIds.length,
        activeTournaments,
      };
    },
    enabled: !!user,
  });
};
