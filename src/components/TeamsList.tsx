import { useUserTeams } from '@/hooks/useUserTeams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Calendar, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { TeamRosterManager } from './TeamRosterManager';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const TeamsList = () => {
  const { teams, isLoading } = useUserTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Teams Yet</h3>
          <p className="text-muted-foreground">
            Create your first team to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{team.name}</CardTitle>
                  {team.logo_url && (
                    <img
                      src={team.logo_url}
                      alt={`${team.name} logo`}
                      className="h-16 w-16 object-contain rounded"
                    />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                <span>{team.member_count} {team.member_count === 1 ? 'member' : 'members'}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Created {format(new Date(team.created_at), 'MMM d, yyyy')}</span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedTeamId(team.id)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Manage Roster
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTeamId && (
        <TeamRosterManager
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
        />
      )}
    </div>
  );
};
