import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImageResponse } from '@/types';

interface Props {
  mainImageUrl: string;
  images: ProductImageResponse[];
  productName: string;
}

export default function ImageGallery({ mainImageUrl, images, productName }: Props) {
  const allImages = images.length > 0 ? images.map((i) => i.imageUrl) : [mainImageUrl];
  const [selected, setSelected] = useState(0);

  const prev = () => setSelected((i) => (i - 1 + allImages.length) % allImages.length);
  const next = () => setSelected((i) => (i + 1) % allImages.length);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="group relative aspect-square bg-bg-secondary border border-border rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={selected}
            src={allImages[selected]}
            alt={productName}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        {/* Arrow nav */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`rounded-full transition-all ${
                    i === selected
                      ? 'w-4 h-1.5 bg-accent'
                      : 'w-1.5 h-1.5 bg-text-muted/50 hover:bg-text-muted'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                i === selected
                  ? 'border-accent'
                  : 'border-border hover:border-border-hover'
              }`}
            >
              <img
                src={src}
                alt={`${productName} view ${i + 1}`}
                className="w-full h-full object-contain p-2 bg-bg-secondary"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
