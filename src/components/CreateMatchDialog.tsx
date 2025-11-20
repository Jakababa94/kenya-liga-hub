import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateMatch } from '@/hooks/useManageMatches';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const matchFormSchema = z.object({
  home_team_id: z.string().min(1, 'Home team is required'),
  away_team_id: z.string().min(1, 'Away team is required'),
  scheduled_at: z.string().min(1, 'Match date and time is required'),
  venue: z.string().optional(),
  round: z.string().optional(),
  match_group: z.string().optional(),
}).refine(data => data.home_team_id !== data.away_team_id, {
  message: 'Home and away teams must be different',
  path: ['away_team_id'],
});

type MatchFormValues = z.infer<typeof matchFormSchema>;

interface CreateMatchDialogProps {
  tournamentId: string;
}

interface Team {
  id: string;
  name: string;
}

export function CreateMatchDialog({ tournamentId }: CreateMatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const createMatch = useCreateMatch();
  const { toast } = useToast();

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      home_team_id: '',
      away_team_id: '',
      scheduled_at: '',
      venue: '',
      round: '',
      match_group: '',
    },
  });

  useEffect(() => {
    if (open) {
      fetchRegisteredTeams();
    }
  }, [open, tournamentId]);

  const fetchRegisteredTeams = async () => {
    setIsLoadingTeams(true);
    try {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('team_id, teams(id, name)')
        .eq('tournament_id', tournamentId)
        .eq('status', 'approved');

      if (error) throw error;

      const teamsData = data
        .map(reg => reg.teams)
        .filter((team): team is Team => team !== null);
      
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: 'Failed to load teams',
        description: 'Could not load registered teams',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const onSubmit = async (values: MatchFormValues) => {
    try {
      await createMatch.mutateAsync({
        tournament_id: tournamentId,
        home_team_id: values.home_team_id,
        away_team_id: values.away_team_id,
        scheduled_at: values.scheduled_at,
        venue: values.venue,
        round: values.round,
        match_group: values.match_group,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Match
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Match</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="home_team_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Team</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingTeams}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select home team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="away_team_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Away Team</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingTeams}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select away team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduled_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    When the match will be played
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Kasarani Stadium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="round"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Round (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Quarter Finals"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="match_group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Group A"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMatch.isPending || isLoadingTeams}
              >
                {createMatch.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Match
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
