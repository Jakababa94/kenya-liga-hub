import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { ProfileEditForm } from '@/components/ProfileEditForm';
import { UserTeamsCard } from '@/components/UserTeamsCard';
import { RegistrationHistory } from '@/components/RegistrationHistory';
import { UserStatsCard } from '@/components/UserStatsCard';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 md:col-span-2 lg:col-span-2">
            <ProfileEditForm />
            <UserStatsCard />
            <RegistrationHistory />
          </div>
          
          <div className="space-y-6">
            <UserTeamsCard />
          </div>
        </div>
      </main>
    </div>
  );
}
