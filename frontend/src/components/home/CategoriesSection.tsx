import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categoriesApi } from '@/services/api';
import SectionHeading from '@/components/shared/SectionHeading';
import Skeleton from '@/components/ui/Skeleton';
import { staggerContainer, staggerItem } from '@/utils/animations';

export default function CategoriesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const categories = data?.filter(c => c.isActive) ?? [];

  return (
    <section id="categories" className="py-20 md:py-28 px-4 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading eyebrow="Explore" title="Browse Categories" subtitle="Shop by your area of interest" gradient className="mb-12" />

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={staggerItem}>
                <Link
                  to={`/category/${category.slug}`}
                  className="group relative block rounded-2xl overflow-hidden border border-border hover:border-accent/40 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-bg-tertiary">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Gradient overlay — stronger at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />

                  {/* Subtle top-right accent glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-transparent transition-all duration-500" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          {category.productCount} products
                        </p>
                        <h3 className="text-text-primary text-xl md:text-2xl font-bold leading-tight">
                          {category.name}
                        </h3>
                      </div>

                      {/* Arrow — slides in on hover */}
                      <div className="flex-shrink-0 w-9 h-9 rounded-full border border-border bg-bg-secondary/80 flex items-center justify-center opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:border-accent/50 group-hover:bg-accent/10 transition-all duration-300">
                        <ArrowRight size={15} className="text-accent" />
                      </div>
                    </div>

                    {/* Product count bar */}
                    <div className="mt-3 h-px bg-border/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent/60 to-accent/20 w-0 group-hover:w-full transition-all duration-500 ease-out"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
