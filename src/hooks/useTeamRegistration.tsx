import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const useTeamRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateTeamSize = async (
    teamId: string,
    tournamentId: string
  ): Promise<ValidationResult> => {
    const errors: string[] = [];

    try {
      // Get tournament requirements
      const { data: tournament, error: tournamentError } = await supabase
        .from('tournaments')
        .select('min_players_per_team, max_players_per_team, max_teams, status')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) throw tournamentError;

      // Check tournament status
      if (tournament.status !== 'registration_open') {
        errors.push('Tournament registration is not open');
        return { isValid: false, errors };
      }

      // Get team member count
      const { count: memberCount, error: countError } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId);

      if (countError) throw countError;

      // Validate team size
      if (tournament.min_players_per_team && memberCount! < tournament.min_players_per_team) {
        errors.push(
          `Team must have at least ${tournament.min_players_per_team} players. Currently has ${memberCount}.`
        );
      }

      if (tournament.max_players_per_team && memberCount! > tournament.max_players_per_team) {
        errors.push(
          `Team cannot have more than ${tournament.max_players_per_team} players. Currently has ${memberCount}.`
        );
      }

      // Check if tournament is full
      if (tournament.max_teams) {
        const { count: registeredTeams, error: regCountError } = await supabase
          .from('tournament_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('tournament_id', tournamentId)
          .in('status', ['approved', 'pending']);

        if (regCountError) throw regCountError;

        if (registeredTeams! >= tournament.max_teams) {
          errors.push('Tournament has reached maximum number of teams');
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    } catch (error) {
      console.error('Error validating team:', error);
      return {
        isValid: false,
        errors: ['Failed to validate team requirements'],
      };
    }
  };

  const registerTeam = async (teamId: string, tournamentId: string) => {
    setIsLoading(true);

    try {
      // Validate team size
      const validation = await validateTeamSize(teamId, tournamentId);

      if (!validation.isValid) {
        toast({
          title: 'Registration Failed',
          description: validation.errors.join('. '),
          variant: 'destructive',
        });
        return { success: false, errors: validation.errors };
      }

      // Register team
      const { data: registration, error } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: tournamentId,
          team_id: teamId,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already Registered',
            description: 'This team is already registered for this tournament.',
            variant: 'destructive',
          });
          return { success: false, errors: ['Team already registered'] };
        }
        throw error;
      }

      toast({
        title: 'Registration Successful',
        description: 'Your team has been registered for the tournament.',
      });

      return { success: true, registration };
    } catch (error) {
      console.error('Error registering team:', error);
      toast({
        title: 'Registration Failed',
        description: 'An error occurred while registering your team.',
        variant: 'destructive',
      });
      return { success: false, errors: ['Registration failed'] };
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawRegistration = async (registrationId: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('tournament_registrations')
        .update({ status: 'withdrawn' })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: 'Registration Withdrawn',
        description: 'Your team registration has been withdrawn.',
      });

      return { success: true };
    } catch (error) {
      console.error('Error withdrawing registration:', error);
      toast({
        title: 'Failed to Withdraw',
        description: 'An error occurred while withdrawing your registration.',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const getTeamRegistration = async (teamId: string, tournamentId: string) => {
    try {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('*')
        .eq('team_id', teamId)
        .eq('tournament_id', tournamentId)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching registration:', error);
      return null;
    }
  };

  return {
    registerTeam,
    withdrawRegistration,
    getTeamRegistration,
    validateTeamSize,
    isLoading,
  };
};
