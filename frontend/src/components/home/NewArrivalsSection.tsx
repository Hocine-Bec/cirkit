import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { productsApi } from '@/services/api';
import ProductCard from '@/components/shared/ProductCard';
import SectionHeading from '@/components/shared/SectionHeading';
import Skeleton from '@/components/ui/Skeleton';
import { staggerContainer } from '@/utils/animations';

export default function NewArrivalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productsApi.getNewArrivals(),
  });

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <SectionHeading
            title="New Arrivals"
            subtitle="The latest additions"
            align="left"
            gradient
          />
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="min-w-[280px] aspect-[3/4] rounded-2xl flex-shrink-0" />
            ))}
          </div>
        ) : (
          <motion.div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {data?.map((product) => (
              <div key={product.id} className="min-w-[280px] snap-start flex-shrink-0">
                <ProductCard product={product} showNewBadge />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
