import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserTeams } from '@/hooks/useUserTeams';
import { Users, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function UserTeamsCard() {
  const { teams, isLoading } = useUserTeams();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          My Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            You haven't created any teams yet
          </p>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {team.logo_url ? (
                    <img
                      src={team.logo_url}
                      alt={team.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{team.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {team.member_count || 0} member{team.member_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Captain</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
