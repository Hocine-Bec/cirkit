import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PackageSearch } from 'lucide-react';
import { productsApi } from '@/services/api';
import ProductCard from '@/components/shared/ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from './Pagination';
import SortDropdown from './SortDropdown';
import { staggerContainer } from '@/utils/animations';

interface Props {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  page: number;
  forceCategoryId?: string;
}

export default function ProductGrid({ categoryId, brand, minPrice, maxPrice, inStock, sortBy, page, forceCategoryId }: Props) {
  const effectiveCategoryId = forceCategoryId || categoryId;

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', effectiveCategoryId, brand, minPrice, maxPrice, inStock, sortBy, page],
    queryFn: () => productsApi.getFiltered({
      categoryId: effectiveCategoryId,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      page,
      pageSize: 12,
    }),
  });

  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <p className="text-sm">
          {isLoading ? (
            <span className="text-text-muted">Loading products…</span>
          ) : (
            <>
              <span className="text-text-primary font-semibold">{data?.totalCount ?? 0}</span>
              <span className="text-text-muted"> products found</span>
            </>
          )}
        </p>
        <SortDropdown />
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-text-muted text-sm">
          Something went wrong. Please try again.
        </div>
      )}

      {!isLoading && !error && data?.items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg-tertiary border border-border flex items-center justify-center mb-4">
            <PackageSearch size={28} className="text-text-muted" />
          </div>
          <h3 className="text-text-primary font-semibold">No products found</h3>
          <p className="text-text-muted text-sm mt-1">Try adjusting or clearing your filters</p>
        </div>
      )}

      {!isLoading && data && data.items.length > 0 && (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          key={`${effectiveCategoryId}-${page}-${sortBy}`}
        >
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}

      {data && <Pagination totalPages={data.totalPages} currentPage={page} />}
    </div>
  );
}
