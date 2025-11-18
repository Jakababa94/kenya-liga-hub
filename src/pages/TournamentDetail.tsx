import { useParams, Link } from 'react-router-dom';
import { useTournament } from '@/hooks/useTournaments';
import { useMatches } from '@/hooks/useMatches';
import { useStandings } from '@/hooks/useStandings';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MatchCard from '@/components/MatchCard';
import StandingsTable from '@/components/StandingsTable';
import { Calendar, MapPin, Trophy, Users, DollarSign, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  draft: 'bg-secondary text-secondary-foreground',
  published: 'bg-blue-500 text-white',
  registration_open: 'bg-green-500 text-white',
  registration_closed: 'bg-orange-500 text-white',
  ongoing: 'bg-purple-500 text-white',
  completed: 'bg-primary text-primary-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

const statusLabels = {
  draft: 'Draft',
  published: 'Published',
  registration_open: 'Registration Open',
  registration_closed: 'Registration Closed',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const categoryLabels = {
  u17: 'Under 17',
  u21: 'Under 21',
  open: 'Open',
  veterans: 'Veterans',
  womens: "Women's",
};

const regionLabels = {
  nairobi: 'Nairobi',
  central: 'Central',
  coast: 'Coast',
  eastern: 'Eastern',
  north_eastern: 'North Eastern',
  nyanza: 'Nyanza',
  rift_valley: 'Rift Valley',
  western: 'Western',
};

export default function TournamentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: tournament, isLoading: tournamentLoading, error: tournamentError } = useTournament(id!);
  const { data: matches, isLoading: matchesLoading } = useMatches(id!);
  const { data: standings, isLoading: standingsLoading } = useStandings(id!);

  if (tournamentLoading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full" />
        </main>
      </>
    );
  }

  if (tournamentError || !tournament) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <Alert variant="destructive">
            <AlertDescription>Failed to load tournament details</AlertDescription>
          </Alert>
        </main>
      </>
    );
  }

  const liveMatches = matches?.filter(m => m.status === 'live') || [];
  const upcomingMatches = matches?.filter(m => m.status === 'scheduled') || [];
  const completedMatches = matches?.filter(m => m.status === 'completed') || [];

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <Link to="/tournaments">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
        </Link>

        {/* Tournament Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl">{tournament.name}</CardTitle>
                  <Badge className={statusColors[tournament.status]}>
                    {statusLabels[tournament.status]}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{tournament.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{regionLabels[tournament.region]}</p>
                  <p className="text-sm">{tournament.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Dates</p>
                  <p className="font-medium">
                    {format(new Date(tournament.start_date), 'MMM d')} - {format(new Date(tournament.end_date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Trophy className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{categoryLabels[tournament.category]}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Entry Fee</p>
                  <p className="font-medium">{tournament.currency} {tournament.entry_fee.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Matches Alert */}
        {liveMatches.length > 0 && (
          <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
            <AlertDescription className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="font-semibold">{liveMatches.length} match{liveMatches.length > 1 ? 'es' : ''} in progress</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            {liveMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Live Matches
                </h2>
                <div className="grid gap-4">
                  {liveMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {upcomingMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Upcoming Matches</h2>
                <div className="grid gap-4">
                  {upcomingMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {completedMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Completed Matches</h2>
                <div className="grid gap-4">
                  {completedMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {matchesLoading && (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}

            {!matchesLoading && matches?.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No matches scheduled yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="standings">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Standings</CardTitle>
              </CardHeader>
              <CardContent>
                {standingsLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <StandingsTable standings={standings || []} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
