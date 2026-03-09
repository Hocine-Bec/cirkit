import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  onChange: (n: number) => void;
  max: number;
  disabled?: boolean;
}

export default function QuantitySelector({ value, onChange, max, disabled }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        className="w-10 h-10 rounded-xl border border-border bg-bg-secondary flex items-center justify-center text-text-secondary hover:border-border-hover disabled:opacity-40 transition-colors"
      >
        <Minus size={16} />
      </button>
      <span className="w-10 text-center text-text-primary font-medium font-mono">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        className="w-10 h-10 rounded-xl border border-border bg-bg-secondary flex items-center justify-center text-text-secondary hover:border-border-hover disabled:opacity-40 transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
