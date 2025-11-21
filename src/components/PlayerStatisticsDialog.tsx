import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpsertPlayerStatistic } from '@/hooks/useManagePlayerStatistics';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3 } from 'lucide-react';
import { Match } from '@/hooks/useMatches';

interface PlayerStatisticsDialogProps {
  match: Match;
}

export default function PlayerStatisticsDialog({ match }: PlayerStatisticsDialogProps) {
  const [open, setOpen] = useState(false);
  const [teamId, setTeamId] = useState<string>('');
  const [playerId, setPlayerId] = useState<string>('');
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [yellowCards, setYellowCards] = useState(0);
  const [redCards, setRedCards] = useState(0);
  const [minutesPlayed, setMinutesPlayed] = useState(0);
  const [shotsOnTarget, setShotsOnTarget] = useState(0);
  const [shotsOffTarget, setShotsOffTarget] = useState(0);
  const [saves, setSaves] = useState(0);

  const upsertStatistic = useUpsertPlayerStatistic();

  // Fetch team members for selected team
  const { data: teamMembers } = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*, player:profiles(id, full_name)')
        .eq('team_id', teamId);

      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });

  const handleSubmit = () => {
    if (!teamId || !playerId) return;

    upsertStatistic.mutate({
      match_id: match.id,
      team_id: teamId,
      player_id: playerId,
      goals,
      assists,
      yellow_cards: yellowCards,
      red_cards: redCards,
      minutes_played: minutesPlayed,
      shots_on_target: shotsOnTarget,
      shots_off_target: shotsOffTarget,
      saves,
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTeamId('');
    setPlayerId('');
    setGoals(0);
    setAssists(0);
    setYellowCards(0);
    setRedCards(0);
    setMinutesPlayed(0);
    setShotsOnTarget(0);
    setShotsOffTarget(0);
    setSaves(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          Add Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Player Statistics</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Team</Label>
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={match.home_team_id}>
                  {match.home_team?.name}
                </SelectItem>
                <SelectItem value={match.away_team_id}>
                  {match.away_team?.name}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {teamId && (
            <div>
              <Label>Player</Label>
              <Select value={playerId} onValueChange={setPlayerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers?.map((member: any) => (
                    <SelectItem key={member.user_id} value={member.user_id}>
                      {member.player?.full_name} {member.jersey_number ? `#${member.jersey_number}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Goals</Label>
              <Input
                type="number"
                min="0"
                value={goals}
                onChange={(e) => setGoals(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Assists</Label>
              <Input
                type="number"
                min="0"
                value={assists}
                onChange={(e) => setAssists(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Yellow Cards</Label>
              <Input
                type="number"
                min="0"
                value={yellowCards}
                onChange={(e) => setYellowCards(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Red Cards</Label>
              <Input
                type="number"
                min="0"
                value={redCards}
                onChange={(e) => setRedCards(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Minutes Played</Label>
              <Input
                type="number"
                min="0"
                max="120"
                value={minutesPlayed}
                onChange={(e) => setMinutesPlayed(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Shots on Target</Label>
              <Input
                type="number"
                min="0"
                value={shotsOnTarget}
                onChange={(e) => setShotsOnTarget(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Shots off Target</Label>
              <Input
                type="number"
                min="0"
                value={shotsOffTarget}
                onChange={(e) => setShotsOffTarget(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Saves</Label>
              <Input
                type="number"
                min="0"
                value={saves}
                onChange={(e) => setSaves(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!teamId || !playerId || upsertStatistic.isPending}
          >
            Save Statistics
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
