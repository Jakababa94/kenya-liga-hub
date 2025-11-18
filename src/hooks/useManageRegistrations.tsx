import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTournamentRegistrations(tournamentId: string) {
  return useQuery({
    queryKey: ['tournament-registrations', tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select(`
          *,
          team:teams(
            id,
            name,
            logo_url,
            captain_id,
            team_members(id)
          )
        `)
        .eq('tournament_id', tournamentId)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!tournamentId,
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      registrationId, 
      status, 
      notes 
    }: { 
      registrationId: string; 
      status: 'approved' | 'rejected'; 
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('tournament_registrations')
        .update({
          status,
          notes,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', registrationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournament-registrations'] });
      toast({
        title: `Registration ${variables.status}`,
        description: `The team registration has been ${variables.status}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update registration',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
