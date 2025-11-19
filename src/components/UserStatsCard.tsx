import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStats } from '@/hooks/useUserStats';
import { Trophy, Target, TrendingUp, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function UserStatsCard() {
  const { data: stats, isLoading } = useUserStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const winRate = stats.totalMatches > 0 
    ? ((stats.wins / stats.totalMatches) * 100).toFixed(1)
    : '0';

  const statCards = [
    {
      title: 'Total Matches',
      value: stats.totalMatches,
      icon: Trophy,
      color: 'text-blue-500',
    },
    {
      title: 'Win Rate',
      value: `${winRate}%`,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Goals Scored',
      value: stats.goalsScored,
      icon: Target,
      color: 'text-orange-500',
    },
    {
      title: 'Total Teams',
      value: stats.totalTeams,
      icon: Users,
      color: 'text-purple-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics & Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="p-4 border rounded-lg bg-card space-y-2"
            >
              <div className="flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
            <p className="text-sm text-muted-foreground">Wins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-500">{stats.draws}</p>
            <p className="text-sm text-muted-foreground">Draws</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
            <p className="text-sm text-muted-foreground">Losses</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
