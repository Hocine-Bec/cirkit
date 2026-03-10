import { motion } from 'framer-motion';

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Bose', 'Google', 'Microsoft', 'Dell', 'HP', 'Lenovo', 'JBL'];
const DOUBLED = [...BRANDS, ...BRANDS];

export default function BrandsTicker() {
  return (
    <div className="py-6 border-y border-border/50 overflow-hidden relative bg-bg-secondary/20">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {DOUBLED.map((brand, i) => (
          <span
            key={i}
            className="text-sm font-semibold uppercase tracking-[0.25em] text-text-muted/60 hover:text-text-muted transition-colors duration-300 cursor-default"
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
