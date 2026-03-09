import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
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
      <Container className="py-12">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
          <div className="flex gap-1 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {tab.label}
                {tab.id === 'reviews' && product.reviewCount > 0 && (
                  <span className="ml-1.5 text-xs text-text-muted">({product.reviewCount})</span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'description' && (
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line max-w-3xl">
                    {product.description}
                  </p>
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
        </div>

        {/* Related Products */}
        <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
      </Container>
    </motion.div>
  );
}
