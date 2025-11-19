import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserRegistration {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  registered_at: string;
  reviewed_at: string | null;
  notes: string | null;
  tournament: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
    venue: string;
  };
  team: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

export const useUserRegistrations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-registrations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get registrations for teams where user is captain or member
      const { data: userTeamIds, error: teamsError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      if (teamsError) throw teamsError;

      const teamIds = userTeamIds?.map(t => t.team_id) || [];

      // Also add teams where user is captain
      const { data: captainTeams, error: captainError } = await supabase
        .from('teams')
        .select('id')
        .eq('captain_id', user.id);

      if (captainError) throw captainError;

      const allTeamIds = [...new Set([...teamIds, ...(captainTeams?.map(t => t.id) || [])])];

      if (allTeamIds.length === 0) return [];

      const { data, error } = await supabase
        .from('tournament_registrations')
        .select(`
          *,
          tournament:tournaments(id, name, start_date, end_date, status, venue),
          team:teams(id, name, logo_url)
        `)
        .in('team_id', allTeamIds)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data as UserRegistration[];
    },
    enabled: !!user,
  });
};
