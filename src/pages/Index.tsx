import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import TournamentCard from "@/components/TournamentCard";
import SearchFilters from "@/components/SearchFilters";
import { ArrowRight, Trophy, Users, Calendar, Shield } from "lucide-react";

const Index = () => {
  // Mock tournament data
  const featuredTournaments = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl">
              Kenya's Premier Football Tournament Platform
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
              Organize, participate, and celebrate football across Kenya. From local derbies to regional championships.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" className="group">
                Register Your Team
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20">
                Browse Tournaments
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Professional Management</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end tournament organization tools
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Team Registration</h3>
              <p className="text-sm text-muted-foreground">
                Streamlined signup with ID verification
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Live Fixtures</h3>
              <p className="text-sm text-muted-foreground">
                Real-time schedules and results
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                M-Pesa & card payments with receipts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Featured Tournaments</h2>
            <p className="text-muted-foreground">
              Join the action in tournaments across Kenya
            </p>
          </div>

          <div className="mb-8">
            <SearchFilters />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTournaments.map((tournament, index) => (
              <TournamentCard key={index} {...tournament} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline">
              View All Tournaments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Whether you're organizing or participating, TourneyKE makes it simple and professional.
            </p>
            <Button size="lg" variant="secondary" className="group">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 TourneyKE. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
