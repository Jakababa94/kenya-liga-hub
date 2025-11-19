import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitiatePayment } from '@/hooks/useInitiatePayment';
import { Loader2, CreditCard } from 'lucide-react';
import { z } from 'zod';

const phoneSchema = z.string()
  .regex(/^(\+?254|0)?[17]\d{8}$/, 'Invalid Kenyan phone number');

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationId: string;
  amount: number;
  tournamentName: string;
}

export function PaymentDialog({
  open,
  onOpenChange,
  registrationId,
  amount,
  tournamentName,
}: PaymentDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { mutate: initiatePayment, isPending } = useInitiatePayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    // Validate phone number
    const result = phoneSchema.safeParse(phoneNumber);
    if (!result.success) {
      setPhoneError(result.error.errors[0].message);
      return;
    }

    initiatePayment(
      { registrationId, phoneNumber, amount },
      {
        onSuccess: () => {
          onOpenChange(false);
          setPhoneNumber('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            M-Pesa Payment
          </DialogTitle>
          <DialogDescription>
            Pay tournament entry fee via M-Pesa STK Push
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tournament</Label>
            <p className="text-sm font-medium">{tournamentName}</p>
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <p className="text-2xl font-bold">KES {amount.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="0712345678 or 254712345678"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError('');
              }}
              required
              disabled={isPending}
            />
            {phoneError && (
              <p className="text-sm text-destructive">{phoneError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter the phone number registered with M-Pesa
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Payment Instructions:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Click "Pay Now" to initiate payment</li>
              <li>An STK Push prompt will appear on your phone</li>
              <li>Enter your M-Pesa PIN to complete the payment</li>
              <li>You'll receive a confirmation SMS</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pay Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
