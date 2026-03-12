import { useState } from 'react';
import { Star, ShoppingCart, Circle, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';
import type { ProductDetailResponse } from '@/types';

interface Props {
  product: ProductDetailResponse;
}

const TRUST_BADGES = [
  { icon: Truck, label: 'Free Shipping', sub: 'Orders over $99' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
  { icon: ShieldCheck, label: 'Secure Pay', sub: 'Encrypted checkout' },
];

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
    <div className="space-y-5">
      {/* Brand */}
      <p className="text-accent text-xs font-semibold uppercase tracking-widest font-mono">
        {product.brand}
      </p>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2.5">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.round(avgRating) ? 'text-warning fill-warning' : 'text-text-muted'}
            />
          ))}
        </div>
        <span className="text-text-primary text-sm font-medium">{avgRating.toFixed(1)}</span>
        <span className="text-text-muted text-sm">·</span>
        <span className="text-text-muted text-sm">{product.reviewCount} reviews</span>
      </div>

      {/* Price */}
      <div>
        <span className="font-mono text-4xl font-bold gradient-text">
          {hasVariants && !selectedVariantId
            ? `From $${product.basePrice.toFixed(2)}`
            : `$${price.toFixed(2)}`}
        </span>
      </div>

      {/* Short description */}
      <p className="text-text-secondary leading-relaxed text-[15px]">{product.shortDescription}</p>

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
        {isOutOfStock
          ? 'Out of Stock'
          : hasVariants && !selectedVariantId
          ? 'Select an Option'
          : 'Add to Cart'}
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
            <span className="text-warning">Only {stock} left in stock</span>
          </>
        ) : (
          <>
            <Circle size={8} className="fill-success text-success" />
            <span className="text-success">In Stock</span>
            <span className="text-text-muted">({stock} available)</span>
          </>
        )}
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-bg-tertiary border border-border"
          >
            <Icon size={15} className="text-accent" />
            <span className="text-text-secondary text-xs font-medium leading-tight">{label}</span>
            <span className="text-text-muted text-[10px] leading-tight">{sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
