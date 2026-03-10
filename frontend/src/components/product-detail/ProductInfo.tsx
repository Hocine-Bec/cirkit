import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Circle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';
import type { ProductDetailResponse } from '@/types';

interface Props {
  product: ProductDetailResponse;
}

export default function ProductInfo({ product }: Props) {
  const { addToCart, openCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  const hasVariants = product.variants.length > 0;
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);

  const price = selectedVariant ? product.basePrice + selectedVariant.priceModifier : product.basePrice;
  const stock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const isOutOfStock = stock === 0;
  const canAddToCart = !isOutOfStock && (!hasVariants || !!selectedVariantId);

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addToCart({
      productId: product.id,
      variantId: selectedVariantId,
      name: product.name,
      variantName: selectedVariant?.name,
      price,
      quantity,
      imageUrl: product.imageUrl,
      maxStock: stock,
      slug: product.slug,
    });
    toast.success('Added to cart!');
    openCart();
  };

  const avgRating = product.averageRating;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link to="/" className="hover:text-text-secondary">Home</Link>
        <span>/</span>
        <Link to={`/category/${product.categoryId}`} className="hover:text-text-secondary">{product.categoryName}</Link>
        <span>/</span>
        <span className="text-text-secondary truncate">{product.name}</span>
      </div>

      {/* Brand */}
      <p className="text-accent text-sm font-medium uppercase tracking-wider">{product.brand}</p>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={14} className={i < Math.round(avgRating) ? 'text-warning fill-warning' : 'text-text-muted'} />
          ))}
        </div>
        <span className="text-text-muted text-sm">({product.reviewCount} reviews)</span>
      </div>

      {/* Price */}
      <div>
        <span className="font-mono text-3xl font-bold text-text-primary">
          {hasVariants && !selectedVariantId ? `From $${product.basePrice.toFixed(2)}` : `$${price.toFixed(2)}`}
        </span>
      </div>

      {/* Short description */}
      <p className="text-text-secondary leading-relaxed">{product.shortDescription}</p>

      <div className="border-t border-border" />

      {/* Variants */}
      {hasVariants && (
        <VariantSelector
          variants={product.variants}
          selectedId={selectedVariantId}
          onSelect={setSelectedVariantId}
          basePrice={product.basePrice}
        />
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <p className="text-text-secondary text-sm font-medium">Qty</p>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={stock}
          disabled={isOutOfStock}
        />
      </div>

      {/* Add to cart */}
      <Button
        variant="primary"
        size="lg"
        className="w-full glow-blue-hover"
        disabled={!canAddToCart}
        onClick={handleAddToCart}
      >
        <ShoppingCart size={18} className="mr-2" />
        {isOutOfStock ? 'Out of Stock' : hasVariants && !selectedVariantId ? 'Select an Option' : 'Add to Cart'}
      </Button>

      {/* Stock indicator */}
      <div className="flex items-center gap-2 text-sm">
        {isOutOfStock ? (
          <>
            <Circle size={8} className="fill-danger text-danger" />
            <span className="text-danger">Out of Stock</span>
          </>
        ) : stock < 10 ? (
          <>
            <Circle size={8} className="fill-warning text-warning" />
            <span className="text-warning">Only {stock} left</span>
          </>
        ) : (
          <>
            <Circle size={8} className="fill-success text-success" />
            <span className="text-success">In Stock ({stock} available)</span>
          </>
        )}
      </div>
    </div>
  );
}
