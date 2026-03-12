import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronRight, Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '@/components/products/FilterSidebar';
import FilterSheet from '@/components/products/FilterSheet';
import ProductGrid from '@/components/products/ProductGrid';
import Container from '@/components/ui/Container';
import { categoriesApi } from '@/services/api';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const categoryId = searchParams.get('categoryId') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const inStock = searchParams.get('inStock') === 'true' ? true : undefined;
  const sortBy = searchParams.get('sortBy') || undefined;
  const page = Number(searchParams.get('page')) || 1;

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const categoryName = categories?.find((c) => c.id === categoryId)?.name;

  const activeFilters = [
    categoryId && { key: 'categoryId', label: `Category: ${categoryName ?? '…'}` },
    brand && { key: 'brand', label: `Brand: ${brand}` },
    minPrice != null && { key: 'minPrice', label: `Min $${minPrice}` },
    maxPrice != null && { key: 'maxPrice', label: `Max $${maxPrice}` },
    inStock && { key: 'inStock', label: 'In Stock Only' },
  ].filter(Boolean) as { key: string; label: string }[];

  const removeFilter = (key: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams({});

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="border-b border-border bg-bg-secondary/40">
        <Container>
          <div className="py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
              <Link to="/" className="hover:text-accent transition-colors flex items-center gap-1">
                <Home size={11} />
                Home
              </Link>
              <ChevronRight size={11} className="text-text-muted/50" />
              <span className="text-text-secondary">All Products</span>
            </nav>

            {/* Title row */}
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="gradient-text">All</span>{' '}
                <span className="text-text-primary">Products</span>
              </h1>

              {/* Mobile filter button */}
              <button
                onClick={() => setFilterOpen(true)}
                className="md:hidden relative flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-bg-tertiary text-text-secondary text-sm hover:border-accent/50 hover:text-accent transition-colors"
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilters.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 size-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>

            {/* Active filter pills */}
            <AnimatePresence>
              {activeFilters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="flex flex-wrap items-center gap-2 overflow-hidden"
                >
                  <span className="text-xs text-text-muted font-medium">Active:</span>
                  {activeFilters.map((f) => (
                    <motion.button
                      key={f.key}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      onClick={() => removeFilter(f.key)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/25 hover:bg-accent/20 transition-colors"
                    >
                      {f.label}
                      <X size={11} />
                    </motion.button>
                  ))}
                  {activeFilters.length > 1 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-text-muted hover:text-danger transition-colors px-2 py-1"
                    >
                      Clear all
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container>
        <div className="flex gap-6 py-8">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
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
