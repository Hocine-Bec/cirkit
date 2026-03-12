import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productsApi } from '@/services/api';
import ProductCard from '@/components/shared/ProductCard';
import { staggerContainer } from '@/utils/animations';

interface Props {
  categoryId: string;
  currentProductId: string;
}

export default function RelatedProducts({ categoryId, currentProductId }: Props) {
  const { data } = useQuery({
    queryKey: ['related', categoryId, currentProductId],
    queryFn: () => productsApi.getFiltered({ categoryId, pageSize: 5 }),
  });

  const related = data?.items.filter((p) => p.id !== currentProductId).slice(0, 4) ?? [];
  if (!related.length) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold mb-8">
        You Might <span className="gradient-text">Also Like</span>
      </h2>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </section>
  );
}
