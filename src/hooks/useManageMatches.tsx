import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MatchStatus } from './useMatches';

interface CreateMatchInput {
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;
  scheduled_at: string;
  venue?: string;
  round?: string;
  match_group?: string;
}

interface UpdateMatchInput {
  id: string;
  home_score?: number;
  away_score?: number;
  status?: MatchStatus;
  venue?: string;
  scheduled_at?: string;
}

export function useCreateMatch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateMatchInput) => {
      const { data, error } = await supabase
        .from('matches')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast({
        title: 'Match created',
        description: 'The match has been created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create match',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateMatch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateMatchInput) => {
      const { data, error } = await supabase
        .from('matches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast({
        title: 'Match updated',
        description: 'The match has been updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update match',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteMatch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (matchId: string) => {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast({
        title: 'Match deleted',
        description: 'The match has been deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete match',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
