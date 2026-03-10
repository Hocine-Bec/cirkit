import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { productsApi } from '@/services/api';
import ProductCard from '@/components/shared/ProductCard';
import SectionHeading from '@/components/shared/SectionHeading';
import Skeleton from '@/components/ui/Skeleton';
import { staggerContainer } from '@/utils/animations';

const CARD_WIDTH = 300;
const GAP = 16;

export default function NewArrivalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productsApi.getNewArrivals(),
  });

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? CARD_WIDTH + GAP : -(CARD_WIDTH + GAP), behavior: 'smooth' });
    }
  };

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  return (
    <section className="relative py-20 md:py-28 px-4 overflow-hidden">
      {/* Subtle section background */}
      <div className="absolute inset-0 bg-bg-secondary/40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Just Dropped"
            title="New Arrivals"
            subtitle="The latest additions to our lineup"
            align="left"
            gradient
          />
          <div className="hidden md:flex items-center gap-3 mb-1">
            <Link
              to="/products?sort=newest"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary border border-border hover:border-accent/50 hover:text-accent px-4 py-2 rounded-xl transition-all duration-200"
            >
              View All <ArrowRight size={14} />
            </Link>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel with fade-out edge */}
        <div
          className="relative"
          style={{
            maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
          }}
        >
          {isLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="flex-shrink-0 rounded-2xl" style={{ width: CARD_WIDTH, aspectRatio: '3/4' }} />
              ))}
            </div>
          ) : (
            <motion.div
              ref={scrollRef}
              onScroll={onScroll}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {data?.map((product) => (
                <div key={product.id} className="snap-start flex-shrink-0" style={{ width: CARD_WIDTH }}>
                  <ProductCard product={product} showNewBadge />
                </div>
              ))}
              {/* Spacer so last card isn't obscured by the fade */}
              <div className="flex-shrink-0 w-16" />
            </motion.div>
          )}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/products?sort=newest"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary border border-border hover:border-accent/50 hover:text-accent px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            View All New Arrivals <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
