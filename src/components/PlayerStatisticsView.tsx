import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePlayerStatistics } from '@/hooks/usePlayerStatistics';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Target, AlertCircle, Clock } from 'lucide-react';

interface PlayerStatisticsViewProps {
  matchId: string;
}

export default function PlayerStatisticsView({ matchId }: PlayerStatisticsViewProps) {
  const { data: statistics, isLoading } = usePlayerStatistics(matchId);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!statistics || statistics.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No player statistics recorded yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center">
                <Award className="w-4 h-4 mx-auto" />
              </TableHead>
              <TableHead className="text-center">
                <Target className="w-4 h-4 mx-auto" />
              </TableHead>
              <TableHead className="text-center">
                <AlertCircle className="w-4 h-4 mx-auto text-yellow-500" />
              </TableHead>
              <TableHead className="text-center">
                <AlertCircle className="w-4 h-4 mx-auto text-red-500" />
              </TableHead>
              <TableHead className="text-center">
                <Clock className="w-4 h-4 mx-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.map((stat) => (
              <TableRow key={stat.id}>
                <TableCell className="font-medium">
                  {stat.player?.full_name}
                </TableCell>
                <TableCell>{stat.team?.name}</TableCell>
                <TableCell className="text-center">{stat.goals}</TableCell>
                <TableCell className="text-center">{stat.assists}</TableCell>
                <TableCell className="text-center">{stat.yellow_cards}</TableCell>
                <TableCell className="text-center">{stat.red_cards}</TableCell>
                <TableCell className="text-center">{stat.minutes_played}'</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
