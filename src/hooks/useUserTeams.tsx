import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Team {
  id: string;
  name: string;
  captain_id: string;
  tournament_id: string | null;
  logo_url: string | null;
  created_at: string;
  member_count?: number;
}

export const useUserTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTeams([]);
      setIsLoading(false);
      return;
    }

    const fetchUserTeams = async () => {
      try {
        // Get teams where user is captain
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('captain_id', user.id);

        if (error) throw error;

        // Get member counts for each team
        if (data) {
          const teamsWithCounts = await Promise.all(
            data.map(async (team) => {
              const { count } = await supabase
                .from('team_members')
                .select('*', { count: 'exact', head: true })
                .eq('team_id', team.id);

              return {
                ...team,
                member_count: count || 0,
              };
            })
          );

          setTeams(teamsWithCounts);
        }
      } catch (error) {
        console.error('Error fetching user teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTeams();
  }, [user]);

  return { teams, isLoading };
};
