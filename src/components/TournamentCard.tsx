import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tournament } from "@/hooks/useTournaments";
import { format } from "date-fns";
import { TeamRegistrationDialog } from "./TeamRegistrationDialog";
import { useAuth } from "@/hooks/useAuth";

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const { user } = useAuth();
  
  const statusColors = {
    draft: "bg-muted text-muted-foreground",
    published: "bg-accent text-accent-foreground",
    registration_open: "bg-primary text-primary-foreground",
    registration_closed: "bg-secondary text-secondary-foreground",
    ongoing: "bg-secondary text-secondary-foreground",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  };

  const statusLabels = {
    draft: "Draft",
    published: "Published",
    registration_open: "Open",
    registration_closed: "Closed",
    ongoing: "Ongoing",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const categoryLabels = {
    u17: "Under 17",
    u21: "Under 21",
    open: "Open",
    veterans: "Veterans",
    womens: "Women's",
  };

  const regionLabels = {
    nairobi: "Nairobi",
    central: "Central",
    coast: "Coast",
    eastern: "Eastern",
    north_eastern: "North Eastern",
    nyanza: "Nyanza",
    rift_valley: "Rift Valley",
    western: "Western",
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  const canRegister = tournament.status === 'registration_open';

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {tournament.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              {regionLabels[tournament.region]}
            </div>
          </div>
          <Badge className={statusColors[tournament.status]}>
            {statusLabels[tournament.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        {tournament.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tournament.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDateRange(tournament.start_date, tournament.end_date)}
          </div>
          <Badge variant="outline">{categoryLabels[tournament.category]}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>Max {tournament.max_teams} Teams</span>
          </div>
          <div className="flex items-center font-semibold text-primary">
            <Trophy className="mr-1 h-4 w-4" />
            {tournament.currency} {tournament.entry_fee.toLocaleString()}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Venue: {tournament.venue}
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        {canRegister && user ? (
          <TeamRegistrationDialog 
            tournamentId={tournament.id}
            tournamentName={tournament.name}
          />
        ) : (
          <Button 
            className="w-full" 
            variant={canRegister ? "default" : "secondary"} 
            disabled={tournament.status === 'cancelled' || tournament.status === 'completed'}
          >
            {canRegister ? "Sign in to Register" : "View Details"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
