-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  registration_id UUID NOT NULL REFERENCES public.tournament_registrations(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  phone_number TEXT NOT NULL,
  merchant_request_id TEXT,
  checkout_request_id TEXT,
  mpesa_receipt_number TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  result_code TEXT,
  result_desc TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
ON public.payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payments"
ON public.payments
FOR UPDATE
USING (true);

CREATE POLICY "Organizers can view payments for their tournaments"
ON public.payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tournament_registrations tr
    JOIN tournaments t ON t.id = tr.tournament_id
    WHERE tr.id = payments.registration_id
    AND t.organizer_id = auth.uid()
  )
);

CREATE POLICY "Super admins can manage all payments"
ON public.payments
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();