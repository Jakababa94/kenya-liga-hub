import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useOrganizerTournaments } from '@/hooks/useOrganizerTournaments';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RegistrationManagement from '@/components/RegistrationManagement';
import MatchManagement from '@/components/MatchManagement';
import { Trophy, Users, Calendar } from 'lucide-react';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { data: tournaments, isLoading, error } = useOrganizerTournaments();
  const [selectedTournament, setSelectedTournament] = useState<string>('');

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load tournaments'}
            </AlertDescription>
          </Alert>
        </main>
      </>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Organizer Dashboard</h1>
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You haven't created any tournaments yet</p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const tournament = selectedTournament
    ? tournaments.find(t => t.id === selectedTournament)
    : tournaments[0];

  if (!tournament) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <Alert variant="destructive">
            <AlertDescription>Tournament not found</AlertDescription>
          </Alert>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Organizer Dashboard</h1>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-muted-foreground" />
            <Select
              value={selectedTournament || tournament.id}
              onValueChange={setSelectedTournament}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tournament Overview */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{tournament.status.replace('_', ' ')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tournament.max_teams}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dates</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="registrations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="registrations">Team Registrations</TabsTrigger>
            <TabsTrigger value="matches">Match Management</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <RegistrationManagement tournamentId={tournament.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Match Management</CardTitle>
              </CardHeader>
              <CardContent>
                <MatchManagement tournamentId={tournament.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
