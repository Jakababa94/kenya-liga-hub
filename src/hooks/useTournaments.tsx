import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type TournamentStatus = 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed' | 'cancelled';
export type TournamentCategory = 'u17' | 'u21' | 'open' | 'veterans' | 'womens';
export type KenyaRegion = 'nairobi' | 'central' | 'coast' | 'eastern' | 'north_eastern' | 'nyanza' | 'rift_valley' | 'western';

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  region: KenyaRegion;
  venue: string;
  category: TournamentCategory;
  status: TournamentStatus;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  entry_fee: number;
  currency: string;
  max_teams: number;
  min_teams: number;
  min_players_per_team: number;
  max_players_per_team: number;
  organizer_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTournamentInput {
  name: string;
  description?: string;
  region: KenyaRegion;
  venue: string;
  category: TournamentCategory;
  status?: TournamentStatus;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  entry_fee: number;
  max_teams: number;
  min_teams?: number;
  min_players_per_team?: number;
  max_players_per_team?: number;
}

export function useTournaments(filters?: {
  status?: TournamentStatus[];
  region?: KenyaRegion;
  category?: TournamentCategory;
}) {
  return useQuery({
    queryKey: ['tournaments', filters],
    queryFn: async () => {
      let query = supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });

      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters?.region) {
        query = query.eq('region', filters.region);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Tournament[];
    },
  });
}

export function useTournament(id: string) {
  return useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Tournament;
    },
    enabled: !!id,
  });
}

export function useCreateTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateTournamentInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a tournament');
      }

      const { data, error } = await supabase
        .from('tournaments')
        .insert({
          ...input,
          organizer_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Tournament;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast({
        title: 'Tournament created',
        description: 'Your tournament has been created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create tournament',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreateTournamentInput> }) => {
      const { data, error } = await supabase
        .from('tournaments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Tournament;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', data.id] });
      toast({
        title: 'Tournament updated',
        description: 'Your tournament has been updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update tournament',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast({
        title: 'Tournament deleted',
        description: 'The tournament has been deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete tournament',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
