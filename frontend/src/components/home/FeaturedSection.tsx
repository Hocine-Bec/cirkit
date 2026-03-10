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
        <SectionHeading
          title="Featured"
          subtitle="Handpicked for tech enthusiasts"
          gradient
          className="mb-12"
        />

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {data?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-glow transition-colors font-medium"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
