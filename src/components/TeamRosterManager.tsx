import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, UserPlus, Trash2, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: string;
  user_id: string;
  role: 'captain' | 'member';
  jersey_number: number | null;
  position: string | null;
  joined_at: string;
  profiles: {
    full_name: string;
  };
}

interface TeamRosterManagerProps {
  teamId: string;
  onClose: () => void;
}

export const TeamRosterManager = ({ teamId, onClose }: TeamRosterManagerProps) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [position, setPosition] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*, profiles(full_name)')
        .eq('team_id', teamId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async () => {
    if (!newMemberEmail.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter a member email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingMember(true);
    try {
      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('email', newMemberEmail.trim().toLowerCase())
        .single();

      if (profileError) {
        toast({
          title: 'User Not Found',
          description: 'No user found with that email. They need to sign up first.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.from('team_members').insert({
        team_id: teamId,
        user_id: profile.id,
        role: 'member',
        jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
        position: position || null,
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already Added',
            description: 'This user is already a member of the team.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: 'Member Added',
        description: 'Team member has been added successfully.',
      });

      setNewMemberEmail('');
      setJerseyNumber('');
      setPosition('');
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: 'Failed to Add Member',
        description: 'An error occurred while adding the team member.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: 'Member Removed',
        description: 'Team member has been removed.',
      });

      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Failed to Remove Member',
        description: 'An error occurred while removing the team member.',
        variant: 'destructive',
      });
    }
  };

  const updateMember = async (memberId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ [field]: value })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: 'Member Updated',
        description: 'Team member has been updated successfully.',
      });

      fetchMembers();
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: 'Failed to Update',
        description: 'An error occurred while updating the team member.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team Roster Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Member Form */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Member
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="member-email">Member Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="member@example.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="jersey-number">Jersey Number</Label>
                    <Input
                      id="jersey-number"
                      type="number"
                      placeholder="e.g., 10"
                      value={jerseyNumber}
                      onChange={(e) => setJerseyNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                        <SelectItem value="Defender">Defender</SelectItem>
                        <SelectItem value="Midfielder">Midfielder</SelectItem>
                        <SelectItem value="Forward">Forward</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={addMember}
                      disabled={isAddingMember}
                      className="w-full"
                    >
                      {isAddingMember ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Member
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Members List */}
          <div className="space-y-3">
            <h3 className="font-semibold">Current Roster ({members.length})</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : members.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No members yet. Add your first team member above.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {member.profiles.full_name}
                              </span>
                              {member.role === 'captain' && (
                                <Badge variant="secondary" className="text-xs">
                                  <Shield className="mr-1 h-3 w-3" />
                                  Captain
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-4 mt-2">
                              <div className="w-24">
                                <Label className="text-xs">Jersey #</Label>
                                <Input
                                  type="number"
                                  placeholder="--"
                                  value={member.jersey_number || ''}
                                  onChange={(e) =>
                                    updateMember(
                                      member.id,
                                      'jersey_number',
                                      e.target.value ? parseInt(e.target.value) : null
                                    )
                                  }
                                  className="h-8"
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-xs">Position</Label>
                                <Select
                                  value={member.position || ''}
                                  onValueChange={(value) =>
                                    updateMember(member.id, 'position', value)
                                  }
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Position" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                                    <SelectItem value="Defender">Defender</SelectItem>
                                    <SelectItem value="Midfielder">Midfielder</SelectItem>
                                    <SelectItem value="Forward">Forward</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>
                        {member.role !== 'captain' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMember(member.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
