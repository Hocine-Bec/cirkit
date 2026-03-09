import { CreditCard, Lock } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function MockPaymentCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-success" />
          <span className="text-text-secondary text-sm font-medium">Payment Details</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Card brand icons as colored badges */}
          {['VISA', 'MC', 'AMEX'].map((brand) => (
            <span
              key={brand}
              className="px-2 py-0.5 rounded text-xs font-bold bg-bg-tertiary text-text-muted border border-border"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-bg-tertiary rounded-xl border border-border p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs text-accent mb-1">
          <CreditCard size={13} />
          <span>Demo mode — no real payment processed</span>
        </div>

        <Input
          label="Card Number"
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          defaultValue="4242 4242 4242 4242"
          readOnly
          className="font-mono"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry"
            id="cardExpiry"
            placeholder="MM/YY"
            defaultValue="12/28"
            readOnly
          />
          <Input
            label="CVC"
            id="cardCvc"
            placeholder="123"
            defaultValue="123"
            readOnly
          />
        </div>

        <Input
          label="Cardholder Name"
          id="cardName"
          placeholder="John Doe"
          defaultValue="Test User"
          readOnly
        />
      </div>
    </div>
  );
}
