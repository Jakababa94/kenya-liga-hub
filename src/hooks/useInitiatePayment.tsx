import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InitiatePaymentParams {
  registrationId: string;
  phoneNumber: string;
  amount: number;
}

export const useInitiatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ registrationId, phoneNumber, amount }: InitiatePaymentParams) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to make a payment');
      }

      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          registrationId,
          phoneNumber,
          amount,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Payment request sent. Check your phone to complete.');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['user-registrations'] });
    },
    onError: (error: any) => {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to initiate payment');
    },
  });
};
