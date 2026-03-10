import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary disabled:opacity-40 hover:border-accent hover:text-accent transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
            p === currentPage
              ? 'bg-accent border-accent text-white'
              : 'border-border text-text-secondary hover:border-accent hover:text-accent'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary disabled:opacity-40 hover:border-accent hover:text-accent transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
