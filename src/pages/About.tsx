import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Users, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold">About TourneyKE</h1>
            
            <div className="prose prose-slate max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                TourneyKE is Kenya's premier digital platform for organizing and participating in regional football tournaments. We're on a mission to democratize access to competitive football and provide professional management tools for organizers across the country.
              </p>

              <div className="grid gap-6 md:grid-cols-2 my-8">
                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Our Mission</h3>
                  <p className="text-sm text-muted-foreground">
                    To make football tournaments accessible, professional, and transparent for everyone in Kenya.
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Our Vision</h3>
                  <p className="text-sm text-muted-foreground">
                    A Kenya where every aspiring footballer has the opportunity to compete and showcase their talent.
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Community First</h3>
                  <p className="text-sm text-muted-foreground">
                    We believe in building strong football communities across all regions of Kenya.
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    Fair play, clear processes, and secure payments for all stakeholders.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-4">What We Offer</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  Comprehensive tournament management tools for organizers
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  Simple team registration with ID verification
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  Secure payment processing via M-Pesa and card payments
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  Real-time fixtures, results, and leaderboards
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  Multi-language support (English & Swahili)
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  SMS and email notifications for all participants
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Compliance & Security</h2>
              <p className="text-muted-foreground">
                TourneyKE is fully compliant with the Kenya Data Protection Act (KDPA). We take data privacy seriously and implement industry-standard security measures to protect all user information. All payments are processed through secure, regulated channels including Safaricom's Daraja API for M-Pesa transactions.
              </p>

              <div className="mt-12 rounded-lg bg-primary/5 p-8 text-center">
                <h2 className="mb-4 text-2xl font-bold">Join the TourneyKE Community</h2>
                <p className="mb-6 text-muted-foreground">
                  Whether you're an organizer, team, or sponsor, we'd love to have you on board.
                </p>
                <Button size="lg">Get Started Today</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
