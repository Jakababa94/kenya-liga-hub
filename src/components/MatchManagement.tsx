import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMatches } from '@/hooks/useMatches';
import { useUpdateMatch, useDeleteMatch } from '@/hooks/useManageMatches';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Play, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { MatchStatus } from '@/hooks/useMatches';
import { CreateMatchDialog } from './CreateMatchDialog';
import PlayerStatisticsDialog from './PlayerStatisticsDialog';
import PlayerStatisticsView from './PlayerStatisticsView';

interface MatchManagementProps {
  tournamentId: string;
}

const statusColors = {
  scheduled: 'bg-secondary text-secondary-foreground',
  live: 'bg-red-500 text-white animate-pulse',
  completed: 'bg-primary text-primary-foreground',
  postponed: 'bg-yellow-500 text-white',
  cancelled: 'bg-destructive text-destructive-foreground',
};

const statusLabels = {
  scheduled: 'Scheduled',
  live: 'Live',
  completed: 'Completed',
  postponed: 'Postponed',
  cancelled: 'Cancelled',
};

export default function MatchManagement({ tournamentId }: MatchManagementProps) {
  const { data: matches, isLoading } = useMatches(tournamentId);
  const updateMatch = useUpdateMatch();
  const deleteMatch = useDeleteMatch();
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('scheduled');

  const handleUpdateScore = (matchId: string) => {
    updateMatch.mutate({
      id: matchId,
      home_score: homeScore,
      away_score: awayScore,
      status: matchStatus,
    });
    setEditingMatch(null);
  };

  const handleStartMatch = (matchId: string) => {
    updateMatch.mutate({
      id: matchId,
      status: 'live',
    });
  };

  const handleCompleteMatch = (matchId: string) => {
    updateMatch.mutate({
      id: matchId,
      status: 'completed',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {matches?.length || 0} match(es) scheduled
        </p>
        <CreateMatchDialog tournamentId={tournamentId} />
      </div>

      {matches?.map(match => (
        <Card key={match.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">
                  {match.home_team?.name} vs {match.away_team?.name}
                </CardTitle>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{format(new Date(match.scheduled_at), 'MMM d, yyyy HH:mm')}</p>
                  {match.venue && <p>Venue: {match.venue}</p>}
                  {match.round && <p>Round: {match.round}</p>}
                </div>
              </div>
              <Badge className={statusColors[match.status]}>
                {statusLabels[match.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {match.home_score} - {match.away_score}
                </div>
                <div className="flex gap-2">
                  {match.status === 'scheduled' && (
                    <Button
                      size="sm"
                      onClick={() => handleStartMatch(match.id)}
                      disabled={updateMatch.isPending}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  )}
                  {match.status === 'live' && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteMatch(match.id)}
                      disabled={updateMatch.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  )}
                  <PlayerStatisticsDialog match={match} />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingMatch(match.id);
                          setHomeScore(match.home_score);
                          setAwayScore(match.away_score);
                          setMatchStatus(match.status);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Match</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              {match.home_team?.name} Score
                            </label>
                            <Input
                              type="number"
                              min="0"
                              value={homeScore}
                              onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              {match.away_team?.name} Score
                            </label>
                            <Input
                              type="number"
                              min="0"
                              value={awayScore}
                              onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Status</label>
                          <Select value={matchStatus} onValueChange={(value: MatchStatus) => setMatchStatus(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="live">Live</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="postponed">Postponed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleUpdateScore(match.id)}
                          disabled={updateMatch.isPending}
                        >
                          Update Match
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMatch.mutate(match.id)}
                    disabled={deleteMatch.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <PlayerStatisticsView matchId={match.id} />
            </div>
          </CardContent>
        </Card>
      ))}

      {matches?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No matches scheduled yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
