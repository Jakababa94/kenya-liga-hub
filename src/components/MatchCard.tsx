import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Match } from '@/hooks/useMatches';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface MatchCardProps {
  match: Match;
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

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <Badge className={statusColors[match.status]}>
          {statusLabels[match.status]}
        </Badge>
        {match.round && (
          <span className="text-sm text-muted-foreground">{match.round}</span>
        )}
      </div>

      <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4 mb-3">
        {/* Home Team */}
        <div className="flex flex-col items-end">
          <span className="font-semibold text-foreground">{match.home_team?.name}</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 px-4">
          <span className="text-2xl font-bold text-foreground">{match.home_score}</span>
          <span className="text-muted-foreground">-</span>
          <span className="text-2xl font-bold text-foreground">{match.away_score}</span>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-start">
          <span className="font-semibold text-foreground">{match.away_team?.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(match.scheduled_at), 'MMM d, yyyy HH:mm')}</span>
        </div>
        {match.venue && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{match.venue}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
