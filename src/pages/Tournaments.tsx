import Navbar from "@/components/Navbar";
import TournamentCard from "@/components/TournamentCard";
import SearchFilters from "@/components/SearchFilters";

const Tournaments = () => {
  // Mock tournament data - expanded list
  const tournaments = [
    {
      title: "Nairobi Premier League 2024",
      region: "Nairobi",
      date: "Dec 15-22, 2024",
      category: "Open",
      teamsRegistered: 12,
      maxTeams: 16,
      entryFee: "KES 15,000",
      status: "open" as const,
    },
    {
      title: "Mombasa Youth Championship",
      region: "Mombasa",
      date: "Jan 10-17, 2025",
      category: "Under 18",
      teamsRegistered: 8,
      maxTeams: 12,
      entryFee: "KES 8,000",
      status: "open" as const,
    },
    {
      title: "Kisumu Regional Cup",
      region: "Kisumu",
      date: "Dec 1-8, 2024",
      category: "Under 21",
      teamsRegistered: 10,
      maxTeams: 10,
      entryFee: "KES 12,000",
      status: "ongoing" as const,
    },
    {
      title: "Nakuru Veterans League",
      region: "Nakuru",
      date: "Jan 20-27, 2025",
      category: "Veterans",
      teamsRegistered: 6,
      maxTeams: 8,
      entryFee: "KES 10,000",
      status: "upcoming" as const,
    },
    {
      title: "Eldoret Schools Championship",
      region: "Eldoret",
      date: "Feb 5-12, 2025",
      category: "Under 15",
      teamsRegistered: 14,
      maxTeams: 16,
      entryFee: "KES 5,000",
      status: "open" as const,
    },
    {
      title: "Coast Region Super Cup",
      region: "Mombasa",
      date: "Nov 20-27, 2024",
      category: "Open",
      teamsRegistered: 16,
      maxTeams: 16,
      entryFee: "KES 20,000",
      status: "closed" as const,
    },
  ];

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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament, index) => (
              <TournamentCard key={index} {...tournament} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tournaments;
