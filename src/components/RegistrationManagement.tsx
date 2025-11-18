import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useTournamentRegistrations, useUpdateRegistration } from '@/hooks/useManageRegistrations';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

interface RegistrationManagementProps {
  tournamentId: string;
}

const statusColors = {
  pending: 'bg-yellow-500 text-white',
  approved: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
  withdrawn: 'bg-gray-500 text-white',
};

const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export default function RegistrationManagement({ tournamentId }: RegistrationManagementProps) {
  const { data: registrations, isLoading } = useTournamentRegistrations(tournamentId);
  const updateRegistration = useUpdateRegistration();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleApprove = (registrationId: string) => {
    updateRegistration.mutate({
      registrationId,
      status: 'approved',
      notes: notes[registrationId],
    });
    setNotes(prev => ({ ...prev, [registrationId]: '' }));
  };

  const handleReject = (registrationId: string) => {
    updateRegistration.mutate({
      registrationId,
      status: 'rejected',
      notes: notes[registrationId],
    });
    setNotes(prev => ({ ...prev, [registrationId]: '' }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const pendingRegistrations = registrations?.filter(r => r.status === 'pending') || [];
  const reviewedRegistrations = registrations?.filter(r => r.status !== 'pending') || [];

  return (
    <div className="space-y-6">
      {/* Pending Registrations */}
      {pendingRegistrations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            Pending Registrations ({pendingRegistrations.length})
          </h3>
          <div className="space-y-4">
            {pendingRegistrations.map(registration => (
              <Card key={registration.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{registration.team?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Registered {format(new Date(registration.registered_at), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                    <Badge className={statusColors[registration.status]}>
                      {statusLabels[registration.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{registration.team?.team_members?.length || 0} players</span>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Review Notes (Optional)</label>
                    <Textarea
                      placeholder="Add notes about this registration..."
                      value={notes[registration.id] || ''}
                      onChange={(e) => setNotes(prev => ({ ...prev, [registration.id]: e.target.value }))}
                      className="mb-3"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(registration.id)}
                      disabled={updateRegistration.isPending}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(registration.id)}
                      disabled={updateRegistration.isPending}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Registrations */}
      {reviewedRegistrations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Reviewed Registrations</h3>
          <div className="space-y-3">
            {reviewedRegistrations.map(registration => (
              <Card key={registration.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{registration.team?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Reviewed {registration.reviewed_at && format(new Date(registration.reviewed_at), 'MMM d, yyyy')}
                      </p>
                      {registration.notes && (
                        <p className="text-sm text-muted-foreground mt-1">Note: {registration.notes}</p>
                      )}
                    </div>
                    <Badge className={statusColors[registration.status]}>
                      {statusLabels[registration.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {registrations?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No registrations yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
