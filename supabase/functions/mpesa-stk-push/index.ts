import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STKPushRequest {
  registrationId: string;
  phoneNumber: string;
  amount: number;
}

async function getAccessToken(): Promise<string> {
  const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
  const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
  
  if (!consumerKey || !consumerSecret) {
    throw new Error('M-Pesa credentials not configured');
  }

  const auth = btoa(`${consumerKey}:${consumerSecret}`);
  
  const response = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get M-Pesa access token');
  }

  const data = await response.json();
  return data.access_token;
}

function generatePassword(shortCode: string, passkey: string, timestamp: string): string {
  const data = `${shortCode}${passkey}${timestamp}`;
  return btoa(data);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { registrationId, phoneNumber, amount }: STKPushRequest = await req.json();
    
    console.log('Initiating STK Push:', { registrationId, phoneNumber, amount });

    // Validate registration
    const { data: registration, error: regError } = await supabase
      .from('tournament_registrations')
      .select('*, tournament:tournaments(name, entry_fee)')
      .eq('id', registrationId)
      .single();

    if (regError || !registration) {
      throw new Error('Registration not found');
    }

    // Get M-Pesa credentials
    const businessShortCode = Deno.env.get('MPESA_BUSINESS_SHORT_CODE');
    const passkey = Deno.env.get('MPESA_PASSKEY');
    const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-callback`;

    if (!businessShortCode || !passkey) {
      throw new Error('M-Pesa configuration incomplete');
    }

    // Format phone number (remove leading + or 0, ensure starts with 254)
    let formattedPhone = phoneNumber.replace(/[\s\-\+]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    // Generate timestamp and password
    const timestamp = new Date().toISOString()
      .replace(/[-:TZ.]/g, '')
      .substring(0, 14);
    const password = generatePassword(businessShortCode, passkey, timestamp);

    // Get access token
    const accessToken = await getAccessToken();

    // Initiate STK Push
    const stkPushResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: businessShortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(amount),
          PartyA: formattedPhone,
          PartyB: businessShortCode,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl,
          AccountReference: registrationId,
          TransactionDesc: `Payment for ${registration.tournament.name}`,
        }),
      }
    );

    const stkData = await stkPushResponse.json();
    console.log('STK Push response:', stkData);

    if (stkData.ResponseCode !== '0') {
      throw new Error(stkData.ResponseDescription || 'STK Push failed');
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        registration_id: registrationId,
        amount: amount,
        phone_number: formattedPhone,
        merchant_request_id: stkData.MerchantRequestID,
        checkout_request_id: stkData.CheckoutRequestID,
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record error:', paymentError);
      throw new Error('Failed to create payment record');
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment,
        message: 'STK Push sent successfully. Please check your phone.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('STK Push error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
