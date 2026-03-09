import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { categoriesApi } from '@/services/api';

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Google', 'Dell', 'HP', 'Lenovo', 'Bose', 'JBL', 'Microsoft'];

interface Props {
  onClose?: () => void;
  hideCategoryFilter?: boolean;
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

  return (
    <div className="bg-bg-secondary/60 backdrop-blur border border-border rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary font-semibold">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Categories */}
      {!hideCategoryFilter && (
        <div>
          <h4 className="text-text-secondary text-sm font-medium mb-3">Category</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={!selectedCategory}
                onChange={() => update('categoryId', null)}
                className="accent-accent"
              />
              <span className="text-text-secondary text-sm">All Categories</span>
            </label>
            {categories?.filter(c => c.isActive).map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.id}
                  onChange={() => update('categoryId', cat.id)}
                  className="accent-accent"
                />
                <span className="text-text-secondary text-sm">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-text-secondary text-sm font-medium mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => update('minPrice', e.target.value || null)}
            className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
          <span className="text-text-muted">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => update('maxPrice', e.target.value || null)}
            className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-text-secondary text-sm font-medium mb-3">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === brand}
                onChange={() => update('brand', selectedBrand === brand ? null : brand)}
                className="accent-accent"
              />
              <span className="text-text-secondary text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center justify-between">
        <h4 className="text-text-secondary text-sm font-medium">In Stock Only</h4>
        <button
          onClick={() => update('inStock', inStock ? null : 'true')}
          className={`w-11 h-6 rounded-full transition-colors relative ${inStock ? 'bg-accent' : 'bg-bg-tertiary border border-border'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${inStock ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      <button
        onClick={clearAll}
        className="w-full py-2 rounded-xl border border-border text-text-secondary text-sm hover:border-border-hover hover:text-text-primary transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}
