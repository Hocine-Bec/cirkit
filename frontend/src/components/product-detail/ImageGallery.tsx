import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ProductImageResponse } from '@/types';

interface Props {
  mainImageUrl: string;
  images: ProductImageResponse[];
  productName: string;
}

export default function ImageGallery({ mainImageUrl, images, productName }: Props) {
  const allImages = images.length > 0 ? images.map(i => i.imageUrl) : [mainImageUrl];
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-square bg-bg-secondary rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={selected}
            src={allImages[selected]}
            alt={productName}
            className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                i === selected ? 'border-accent' : 'border-border hover:border-border-hover'
              }`}
            >
              <img src={src} alt={`${productName} view ${i + 1}`} className="w-full h-full object-contain p-2 bg-bg-secondary" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
