import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import { SORT_OPTIONS } from '@/utils/constants';

const ALL_OPTIONS = [{ value: '', label: 'Default' }, ...SORT_OPTIONS];

export default function SortDropdown() {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get('sortBy') || '';
  const ref = useRef<HTMLDivElement>(null);

  const currentLabel = ALL_OPTIONS.find((o) => o.value === current)?.label ?? 'Default';

  const select = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('sortBy', value); else next.delete('sortBy');
    next.delete('page');
    setSearchParams(next);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg-secondary text-text-primary text-sm hover:border-accent/50 transition-colors focus:outline-none"
      >
        <span className="text-text-muted text-xs">Sort:</span>
        <span className="font-medium">{currentLabel}</span>
        <ChevronDown
          size={14}
          className={`text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-bg-secondary border border-border rounded-xl shadow-lg overflow-hidden z-20">
          {ALL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-bg-tertiary transition-colors"
            >
              <span className={current === opt.value ? 'text-accent font-medium' : 'text-text-secondary'}>
                {opt.label}
              </span>
              {current === opt.value && <Check size={13} className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
