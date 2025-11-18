import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'super_admin' | 'organizer' | 'public';

export function useUserRole() {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;
      
      return data.map(r => r.role as AppRole);
    },
  });
}

export function useHasRole(role: AppRole) {
  const { data: roles } = useUserRole();
  return roles?.includes(role) || false;
}
