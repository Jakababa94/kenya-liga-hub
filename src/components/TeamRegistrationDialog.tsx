import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUserTeams } from '@/hooks/useUserTeams';
import { useTeamRegistration } from '@/hooks/useTeamRegistration';
import { Loader2, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TeamRegistrationDialogProps {
  tournamentId: string;
  tournamentName: string;
}

export const TeamRegistrationDialog = ({
  tournamentId,
  tournamentName,
}: TeamRegistrationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const { teams, isLoading: teamsLoading } = useUserTeams();
  const { registerTeam, isLoading: registering } = useTeamRegistration();

  const handleRegister = async () => {
    if (!selectedTeamId) return;

    const result = await registerTeam(selectedTeamId, tournamentId);
    if (result.success) {
      setOpen(false);
      setSelectedTeamId('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Register Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for {tournamentName}</DialogTitle>
          <DialogDescription>
            Select a team to register for this tournament
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {teamsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : teams.length === 0 ? (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                You don't have any teams yet. Create a team first to register for tournaments.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <RadioGroup value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <div className="space-y-3">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center space-x-2 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                    >
                      <RadioGroupItem value={team.id} id={team.id} />
                      <Label htmlFor={team.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {team.member_count} {team.member_count === 1 ? 'member' : 'members'}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                  disabled={registering}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRegister}
                  disabled={!selectedTeamId || registering}
                  className="flex-1"
                >
                  {registering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register Team'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
