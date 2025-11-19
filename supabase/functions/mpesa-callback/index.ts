import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const callbackData = await req.json();
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2));

    const { Body: { stkCallback } } = callbackData;
    
    const merchantRequestId = stkCallback.MerchantRequestID;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // Find the payment record
    const { data: payment, error: findError } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .single();

    if (findError || !payment) {
      console.error('Payment not found:', findError);
      return new Response(
        JSON.stringify({ error: 'Payment not found' }),
        { status: 404 }
      );
    }

    // Update payment status
    const updateData: any = {
      result_code: resultCode.toString(),
      result_desc: resultDesc,
      updated_at: new Date().toISOString(),
    };

    if (resultCode === 0) {
      // Payment successful
      updateData.status = 'completed';
      
      // Extract M-Pesa receipt from callback metadata
      if (stkCallback.CallbackMetadata?.Item) {
        const items = stkCallback.CallbackMetadata.Item;
        const receiptItem = items.find((item: any) => item.Name === 'MpesaReceiptNumber');
        if (receiptItem) {
          updateData.mpesa_receipt_number = receiptItem.Value;
        }
      }

      // Update registration status to approved
      await supabase
        .from('tournament_registrations')
        .update({ status: 'approved' })
        .eq('id', payment.registration_id);
        
      console.log('Payment completed and registration approved');
    } else {
      // Payment failed
      updateData.status = 'failed';
      console.log('Payment failed:', resultDesc);
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Callback processed' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Callback processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
