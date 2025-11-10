import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TournamentCardProps {
  title: string;
  region: string;
  date: string;
  category: string;
  teamsRegistered: number;
  maxTeams: number;
  entryFee: string;
  status: "open" | "upcoming" | "ongoing" | "closed";
}

const TournamentCard = ({
  title,
  region,
  date,
  category,
  teamsRegistered,
  maxTeams,
  entryFee,
  status,
}: TournamentCardProps) => {
  const statusColors = {
    open: "bg-primary text-primary-foreground",
    upcoming: "bg-accent text-accent-foreground",
    ongoing: "bg-secondary text-secondary-foreground",
    closed: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              {region}
            </div>
          </div>
          <Badge className={statusColors[status]}>{status.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {date}
          </div>
          <Badge variant="outline">{category}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>
              {teamsRegistered}/{maxTeams} Teams
            </span>
          </div>
          <div className="flex items-center font-semibold text-primary">
            <Trophy className="mr-1 h-4 w-4" />
            {entryFee}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Button className="w-full" variant={status === "open" ? "default" : "secondary"} disabled={status === "closed"}>
          {status === "open" ? "Register Now" : status === "upcoming" ? "View Details" : "View Tournament"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
