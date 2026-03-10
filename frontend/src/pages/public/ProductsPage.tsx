import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import FilterSidebar from '@/components/products/FilterSidebar';
import FilterSheet from '@/components/products/FilterSheet';
import ProductGrid from '@/components/products/ProductGrid';
import Container from '@/components/ui/Container';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const categoryId = searchParams.get('categoryId') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const inStock = searchParams.get('inStock') === 'true' ? true : undefined;
  const sortBy = searchParams.get('sortBy') || undefined;
  const page = Number(searchParams.get('page')) || 1;

  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">All Products</h1>
          <button
            onClick={() => setFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-text-secondary text-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Product grid */}
          <ProductGrid
            categoryId={categoryId}
            brand={brand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            inStock={inStock}
            sortBy={sortBy}
            page={page}
          />
        </div>
      </Container>

      {/* Mobile filter sheet */}
      <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
