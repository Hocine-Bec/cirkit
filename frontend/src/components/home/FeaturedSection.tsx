import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { productsApi } from '@/services/api';
import ProductCard from '@/components/shared/ProductCard';
import SectionHeading from '@/components/shared/SectionHeading';
import Skeleton from '@/components/ui/Skeleton';
import { staggerContainer } from '@/utils/animations';

export default function FeaturedSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getFeatured(),
  });

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex items-end justify-between gap-4 mb-12">
          <SectionHeading
            eyebrow="Top Picks"
            title="Featured"
            subtitle="Handpicked for tech enthusiasts"
            gradient
            align="left"
          />
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-text-secondary border border-border hover:border-accent/50 hover:text-accent px-5 py-2.5 rounded-xl transition-all duration-200 flex-shrink-0 mb-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {data?.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary border border-border hover:border-accent/50 hover:text-accent px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            View All Products <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
