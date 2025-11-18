import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Standing } from '@/hooks/useStandings';

interface StandingsTableProps {
  standings: Standing[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GA</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center font-bold">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing, index) => (
            <TableRow key={standing.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-semibold">{standing.team?.name}</TableCell>
              <TableCell className="text-center">{standing.played}</TableCell>
              <TableCell className="text-center">{standing.won}</TableCell>
              <TableCell className="text-center">{standing.drawn}</TableCell>
              <TableCell className="text-center">{standing.lost}</TableCell>
              <TableCell className="text-center">{standing.goals_for}</TableCell>
              <TableCell className="text-center">{standing.goals_against}</TableCell>
              <TableCell className="text-center">{standing.goal_difference}</TableCell>
              <TableCell className="text-center font-bold">{standing.points}</TableCell>
            </TableRow>
          ))}
          {standings.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                No standings available yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
