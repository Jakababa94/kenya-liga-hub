import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRegistrations } from '@/hooks/useUserRegistrations';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  withdrawn: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function RegistrationHistory() {
  const { data: registrations, isLoading } = useUserRegistrations();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tournament Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        {!registrations || registrations.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No tournament registrations yet
          </p>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="p-4 border rounded-lg bg-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{reg.tournament.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Team: {reg.team.name}
                    </p>
                  </div>
                  <Badge className={statusColors[reg.status]}>
                    {reg.status}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {format(new Date(reg.tournament.start_date), 'MMM d, yyyy')} - {format(new Date(reg.tournament.end_date), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {reg.tournament.venue}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Registered on {format(new Date(reg.registered_at), 'PPP')}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
