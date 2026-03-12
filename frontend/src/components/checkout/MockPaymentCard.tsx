import { CreditCard, FlaskConical } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function MockPaymentCard() {
  return (
    <div className="space-y-4">
      {/* Card brand logos row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>Accepted cards</span>
        </div>
        <div className="flex items-center gap-1.5">
          {['VISA', 'MC', 'AMEX'].map((brand) => (
            <span
              key={brand}
              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-bg-tertiary text-text-secondary border border-border tracking-wider"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-2.5 bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
        <FlaskConical size={14} className="text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-accent text-xs font-semibold">Demo Mode</p>
          <p className="text-text-muted text-xs mt-0.5">No real payment is processed. Use the prefilled test card below.</p>
        </div>
      </div>

      {/* Card fields */}
      <div className="bg-bg-tertiary rounded-xl border border-border p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
          <CreditCard size={13} />
          <span>Test card details</span>
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
