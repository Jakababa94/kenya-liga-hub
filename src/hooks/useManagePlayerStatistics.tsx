import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpsertPlayerStatisticInput {
  match_id: string;
  team_id: string;
  player_id: string;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  minutes_played?: number;
  shots_on_target?: number;
  shots_off_target?: number;
  saves?: number;
  fouls_committed?: number;
  fouls_suffered?: number;
}

export function useUpsertPlayerStatistic() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpsertPlayerStatisticInput) => {
      const { error } = await supabase
        .from('player_statistics')
        .upsert({
          match_id: input.match_id,
          team_id: input.team_id,
          player_id: input.player_id,
          goals: input.goals || 0,
          assists: input.assists || 0,
          yellow_cards: input.yellow_cards || 0,
          red_cards: input.red_cards || 0,
          minutes_played: input.minutes_played || 0,
          shots_on_target: input.shots_on_target || 0,
          shots_off_target: input.shots_off_target || 0,
          saves: input.saves || 0,
          fouls_committed: input.fouls_committed || 0,
          fouls_suffered: input.fouls_suffered || 0,
        }, {
          onConflict: 'match_id,player_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-statistics'] });
      toast({
        title: 'Success',
        description: 'Player statistics updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update player statistics',
        variant: 'destructive',
      });
    },
  });
}

export function useDeletePlayerStatistic() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('player_statistics')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-statistics'] });
      toast({
        title: 'Success',
        description: 'Player statistics deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete player statistics',
        variant: 'destructive',
      });
    },
  });
}
