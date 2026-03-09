import { useSearchParams } from 'react-router-dom';
import { SORT_OPTIONS } from '@/utils/constants';

export default function SortDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get('sortBy') || '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(searchParams);
    if (e.target.value) next.set('sortBy', e.target.value);
    else next.delete('sortBy');
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      className="bg-bg-secondary border border-border text-text-primary rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent"
    >
      <option value="">Sort: Default</option>
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
