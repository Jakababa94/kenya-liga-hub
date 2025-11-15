import Navbar from "@/components/Navbar";
import TournamentCard from "@/components/TournamentCard";
import SearchFilters from "@/components/SearchFilters";
import { useTournaments } from "@/hooks/useTournaments";
import { Skeleton } from "@/components/ui/skeleton";

const Tournaments = () => {
  const { data: tournaments, isLoading, error } = useTournaments({
    status: ['published', 'registration_open', 'registration_closed', 'ongoing']
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">All Tournaments</h1>
            <p className="text-muted-foreground">
              Browse and register for football tournaments across Kenya
            </p>
          </div>

          <div className="mb-8">
            <SearchFilters />
          </div>

          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[300px] w-full" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load tournaments. Please try again.</p>
            </div>
          )}

          {!isLoading && !error && tournaments && tournaments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tournaments available at the moment.</p>
            </div>
          )}

          {!isLoading && !error && tournaments && tournaments.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tournaments;
