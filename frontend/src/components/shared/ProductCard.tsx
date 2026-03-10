import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { staggerItem } from '@/utils/animations';
import type { ProductResponse, CartItem } from '@/types';
import toast from 'react-hot-toast';

interface Props {
  product: ProductResponse;
  showNewBadge?: boolean;
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={12}
      className={i < Math.round(rating) ? 'text-warning fill-warning' : 'text-text-muted'}
    />
  ));
}

export default function ProductCard({ product, showNewBadge }: Props) {
  const { addToCart } = useCart();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    e.currentTarget.style.transition = '';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    e.currentTarget.style.transition = 'transform 0.5s ease';
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
      imageUrl: product.imageUrl,
      maxStock: product.stockQuantity,
      slug: product.slug,
    };
    addToCart(item);
    toast.success('Added to cart!');
  };

  return (
    <motion.div variants={staggerItem}>
      <div
        className="group relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative rounded-2xl overflow-hidden border border-border bg-bg-tertiary hover:border-accent/30 transition-colors duration-300">
          <Link to={`/products/${product.slug}`} className="block">
            {/* Image */}
            <div className="relative aspect-square bg-bg-secondary overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.stockQuantity === 0 && (
                <div className="absolute inset-0 bg-bg-primary/80 flex items-center justify-center">
                  <span className="text-danger text-sm font-medium">Out of Stock</span>
                </div>
              )}
              {product.isFeatured && (
                <div className="absolute top-3 left-3">
                  <span className="backdrop-blur-sm bg-bg-primary/80 text-accent text-xs font-medium px-2 py-1 rounded-full border border-accent/40">
                    Featured
                  </span>
                </div>
              )}
              {showNewBadge && (
                <div className="absolute top-3 right-3">
                  <span className="backdrop-blur-sm bg-bg-primary/80 text-success text-xs font-medium px-2 py-1 rounded-full border border-success/40">
                    New
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 pb-2">
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium">{product.brand}</p>
              <h3 className="text-text-primary font-medium mt-1 line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-0.5 mt-1.5">
                {renderStars(product.averageRating)}
                <span className="text-text-muted text-xs ml-1">({product.reviewCount})</span>
              </div>
              <p className="text-text-primary font-semibold font-mono text-lg mt-2 pb-3">
                ${product.basePrice.toFixed(2)}
              </p>
            </div>
          </Link>

          {/* Add to cart overlay */}
          {product.stockQuantity > 0 && (
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 bg-gradient-to-t from-bg-tertiary via-bg-tertiary/95 to-transparent">
              <button
                onClick={handleAddToCart}
                className="w-full bg-accent hover:bg-accent-glow text-white py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
