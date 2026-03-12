import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { productsApi } from '@/services/api';
import Container from '@/components/ui/Container';
import Skeleton from '@/components/ui/Skeleton';
import ImageGallery from '@/components/product-detail/ImageGallery';
import ProductInfo from '@/components/product-detail/ProductInfo';
import SpecificationsTable from '@/components/product-detail/SpecificationsTable';
import ReviewsSection from '@/components/product-detail/ReviewsSection';
import RelatedProducts from '@/components/product-detail/RelatedProducts';
import { fadeIn } from '@/utils/animations';

type Tab = 'description' | 'specifications' | 'reviews';

const TABS: { id: Tab; label: string }[] = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'reviews', label: 'Reviews' },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('description');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-24 text-center">
        <p className="text-text-muted">Product not found.</p>
      </Container>
    );
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      {/* Breadcrumb bar */}
      <div className="border-b border-border bg-bg-secondary/40">
        <Container>
          <nav className="flex items-center gap-1.5 text-xs text-text-muted py-3">
            <Link to="/" className="hover:text-accent transition-colors flex items-center gap-1">
              <Home size={11} /> Home
            </Link>
            <ChevronRight size={11} className="text-text-muted/50" />
            <Link
              to={`/products?categoryId=${product.categoryId}`}
              className="hover:text-accent transition-colors"
            >
              {product.categoryName}
            </Link>
            <ChevronRight size={11} className="text-text-muted/50" />
            <span className="text-text-secondary truncate max-w-[200px]">{product.name}</span>
          </nav>
        </Container>
      </div>

      <Container className="py-10">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          <ImageGallery
            mainImageUrl={product.imageUrl}
            images={product.images}
            productName={product.name}
          />
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          {/* Tab bar — pill/segmented style */}
          <div className="flex gap-1 bg-bg-tertiary border border-border rounded-xl p-1 w-fit mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-bg-secondary text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {tab.label}
                {tab.id === 'reviews' && product.reviewCount > 0 && (
                  <span
                    className={`ml-1.5 text-xs transition-colors ${
                      activeTab === tab.id ? 'text-accent' : 'text-text-muted'
                    }`}
                  >
                    ({product.reviewCount})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'description' && (
                <div className="max-w-3xl bg-bg-secondary/50 border border-border rounded-2xl p-6 md:p-8">
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line text-[15px]">
                    {product.description}
                  </p>
                </div>
              )}
              {activeTab === 'specifications' && (
                <div className="max-w-2xl">
                  <SpecificationsTable specifications={product.specifications} />
                </div>
              )}
              {activeTab === 'reviews' && (
                <ReviewsSection reviews={product.reviews} productId={product.id} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
      </Container>
    </motion.div>
  );
}
