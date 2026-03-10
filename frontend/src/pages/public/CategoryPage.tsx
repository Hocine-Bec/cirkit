import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import { categoriesApi } from '@/services/api';
import Container from '@/components/ui/Container';
import Skeleton from '@/components/ui/Skeleton';
import ProductGrid from '@/components/products/ProductGrid';
import FilterSidebar from '@/components/products/FilterSidebar';
import FilterSheet from '@/components/products/FilterSheet';

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: category, isLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const brand = searchParams.get('brand') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const inStock = searchParams.get('inStock') === 'true' ? true : undefined;
  const sortBy = searchParams.get('sortBy') || undefined;
  const page = Number(searchParams.get('page')) || 1;

  return (
    <>
      {/* Category Banner */}
      <div className="relative bg-bg-secondary border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: category?.imageUrl ? `url(${category.imageUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent" />
        <Container className="relative py-14">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-text-primary">{category?.name}</h1>
              {category?.description && (
                <p className="text-text-secondary mt-2 max-w-xl">{category.description}</p>
              )}
              {category?.productCount !== undefined && (
                <p className="text-text-muted text-sm mt-3">{category.productCount} products</p>
              )}
            </>
          )}
        </Container>
      </div>

      <Container className="py-8">
        {/* Mobile filter button */}
        <div className="flex justify-end mb-4 lg:hidden">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors text-sm"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar hideCategoryFilter />
          </aside>

          {/* Grid */}
          {category ? (
            <ProductGrid
              forceCategoryId={category.id}
              brand={brand}
              minPrice={minPrice}
              maxPrice={maxPrice}
              inStock={inStock}
              sortBy={sortBy}
              page={page}
            />
          ) : !isLoading ? (
            <div className="flex-1 py-24 text-center text-text-muted">
              Category not found.
            </div>
          ) : null}
        </div>
      </Container>

      {/* Mobile FilterSheet */}
      <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} hideCategoryFilter />
    </>
  );
}
