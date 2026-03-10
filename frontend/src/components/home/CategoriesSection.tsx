import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { categoriesApi } from '@/services/api';
import SectionHeading from '@/components/shared/SectionHeading';
import Skeleton from '@/components/ui/Skeleton';
import { staggerContainer, staggerItem } from '@/utils/animations';

export default function CategoriesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  return (
    <section id="categories" className="py-20 md:py-28 px-4 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Browse Categories" subtitle="Shop by your area of interest" gradient className="mb-12" />

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-2xl" />
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
            {data?.filter(c => c.isActive).map((category) => (
              <motion.div key={category.id} variants={staggerItem}>
                <Link
                  to={`/category/${category.slug}`}
                  className="group relative block rounded-2xl overflow-hidden border border-border hover:border-accent/30 transition-colors duration-300"
                >
                  <div className="aspect-video overflow-hidden bg-bg-tertiary">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-text-primary text-xl font-semibold">{category.name}</h3>
                    <p className="text-text-secondary text-sm mt-0.5">{category.productCount} products</p>
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
