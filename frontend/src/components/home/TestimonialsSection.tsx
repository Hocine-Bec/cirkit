import { motion } from 'framer-motion';
import { Star, BadgeCheck } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import { staggerContainer, staggerItem } from '@/utils/animations';

const TESTIMONIALS = [
  {
    name: 'Alex K.',
    role: 'Software Engineer',
    rating: 5,
    text: 'Best electronics store I\'ve found online. My RTX 4090 arrived next day in perfect condition — exactly as described.',
    verified: true,
  },
  {
    name: 'Sarah M.',
    role: 'Content Creator',
    rating: 5,
    text: 'Incredible product range and competitive prices. My entire studio setup is now complete thanks to CirKit.',
    verified: true,
  },
  {
    name: 'James T.',
    role: 'Hardware Enthusiast',
    rating: 5,
    text: 'Customer support is exceptional. Had an issue with my order and it was resolved within hours. Will definitely buy again.',
    verified: true,
  },
  {
    name: 'Priya N.',
    role: 'IoT Developer',
    rating: 4,
    text: 'Great selection of components for my projects. Shipping was fast and every part was packaged with care.',
    verified: true,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-border'}
        />
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-bg-secondary/30 section-glow">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Customer Stories"
          title="What Customers Say"
          subtitle="Trusted by thousands of tech enthusiasts"
          gradient
          className="mb-14"
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              className="glass card-hover rounded-2xl p-6 border border-border hover:border-accent/30 flex flex-col gap-4 relative overflow-hidden group"
            >
              {/* Decorative quote mark */}
              <span className="absolute top-3 right-4 text-7xl font-serif leading-none text-accent/8 group-hover:text-accent/12 transition-colors duration-300 select-none pointer-events-none">
                "
              </span>

              <Stars rating={t.rating} />

              <p className="text-text-secondary text-sm leading-relaxed flex-1 relative z-10">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <Avatar name={t.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-text-primary text-sm font-semibold truncate">{t.name}</p>
                    {t.verified && (
                      <BadgeCheck size={13} className="text-accent flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-text-muted text-xs truncate">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Aggregate rating strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex items-center justify-center gap-3 text-text-muted text-sm"
        >
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <span>
            <span className="text-text-primary font-semibold">4.8</span> out of 5 — based on{' '}
            <span className="text-text-primary font-semibold">25,000+</span> reviews
          </span>
        </motion.div>
      </div>
    </section>
  );
}
