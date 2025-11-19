import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Payment {
  id: string;
  user_id: string;
  registration_id: string;
  amount: number;
  phone_number: string;
  merchant_request_id: string | null;
  checkout_request_id: string | null;
  mpesa_receipt_number: string | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  result_code: string | null;
  result_desc: string | null;
  created_at: string;
  updated_at: string;
}

export const usePayments = (registrationId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['payments', user?.id, registrationId],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (registrationId) {
        query = query.eq('registration_id', registrationId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!user,
  });
};
