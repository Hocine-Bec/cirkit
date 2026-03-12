import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X, Tag, DollarSign, Boxes, Package } from 'lucide-react';
import { categoriesApi } from '@/services/api';

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Google', 'Dell', 'HP', 'Lenovo', 'Bose', 'JBL', 'Microsoft'];

interface Props {
  onClose?: () => void;
  hideCategoryFilter?: boolean;
}

function FilterSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={13} className="text-accent" />
        <h4 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export default function FilterSidebar({ onClose, hideCategoryFilter }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.getAll() });

  const selectedCategory = searchParams.get('categoryId') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') === 'true';

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const clearAll = () => {
    setSearchParams({});
    onClose?.();
  };

  const pillBase = 'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer';
  const pillActive = 'bg-accent/15 border-accent/50 text-accent';
  const pillInactive = 'border-border text-text-muted hover:border-border-hover hover:text-text-secondary bg-transparent';

  return (
    <div className="bg-bg-secondary/60 backdrop-blur border border-border rounded-2xl p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary font-semibold text-sm">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Categories */}
      {!hideCategoryFilter && (
        <FilterSection icon={Boxes} title="Category">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => update('categoryId', null)}
              className={`${pillBase} ${!selectedCategory ? pillActive : pillInactive}`}
            >
              All
            </button>
            {categories?.filter((c) => c.isActive).map((cat) => (
              <button
                key={cat.id}
                onClick={() => update('categoryId', cat.id)}
                className={`${pillBase} ${selectedCategory === cat.id ? pillActive : pillInactive}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection icon={DollarSign} title="Price Range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => update('minPrice', e.target.value || null)}
            className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
          <span className="text-text-muted text-xs flex-shrink-0">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => update('maxPrice', e.target.value || null)}
            className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection icon={Tag} title="Brand">
        <div className="flex flex-wrap gap-1.5">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => update('brand', selectedBrand === b ? null : b)}
              className={`${pillBase} ${selectedBrand === b ? pillActive : pillInactive}`}
            >
              {b}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* In Stock */}
      <FilterSection icon={Package} title="Availability">
        <button
          onClick={() => update('inStock', inStock ? null : 'true')}
          className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
            inStock
              ? 'bg-accent/10 border-accent/40 text-accent'
              : 'border-border text-text-secondary hover:border-border-hover'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
              inStock ? 'border-accent bg-accent' : 'border-border'
            }`}
          >
            {inStock && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </span>
          In Stock Only
        </button>
      </FilterSection>

      <button
        onClick={clearAll}
        className="w-full py-2 rounded-xl border border-border text-text-muted text-xs font-medium hover:border-danger/40 hover:text-danger transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
