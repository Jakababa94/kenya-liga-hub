import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const teamFormSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(100),
  logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

interface CreateTeamFormProps {
  onSuccess?: () => void;
}

export const CreateTeamForm = ({ onSuccess }: CreateTeamFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      logo_url: '',
    },
  });

  const onSubmit = async (values: TeamFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Create the team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: values.name,
          captain_id: user.id,
          logo_url: values.logo_url || null,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Automatically add captain as team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'captain',
        });

      if (memberError) throw memberError;

      toast({
        title: 'Team Created',
        description: 'Your team has been created successfully.',
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: 'Failed to Create Team',
        description: 'An error occurred while creating your team.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Team</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter team name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a unique name for your team
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Logo URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormDescription>
                    Link to your team's logo image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Team'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
