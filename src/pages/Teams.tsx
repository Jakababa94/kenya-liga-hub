import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateTeamForm } from '@/components/CreateTeamForm';
import { TeamsList } from '@/components/TeamsList';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Teams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-teams');

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You need to be signed in to manage teams.
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex gap-4 justify-center">
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
              <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Team Management</h1>
            <p className="text-muted-foreground">
              Create and manage your teams, add players, and register for tournaments
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="my-teams">
                <Users className="mr-2 h-4 w-4" />
                My Teams
              </TabsTrigger>
              <TabsTrigger value="create">Create Team</TabsTrigger>
            </TabsList>

            <TabsContent value="my-teams" className="mt-6">
              <TeamsList />
            </TabsContent>

            <TabsContent value="create" className="mt-6">
              <div className="max-w-2xl">
                <CreateTeamForm onSuccess={() => setActiveTab('my-teams')} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Teams;
