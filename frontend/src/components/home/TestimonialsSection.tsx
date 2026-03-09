import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import { staggerContainer, staggerItem } from '@/utils/animations';

const TESTIMONIALS = [
  {
    name: 'Alex K.',
    role: 'Software Engineer',
    rating: 5,
    text: 'Best electronics store I\'ve found online. My RTX 4090 arrived next day in perfect condition — exactly as described.',
  },
  {
    name: 'Sarah M.',
    role: 'Content Creator',
    rating: 5,
    text: 'Incredible product range and competitive prices. My entire studio setup is now complete thanks to CirKit.',
  },
  {
    name: 'James T.',
    role: 'Hardware Enthusiast',
    rating: 5,
    text: 'Customer support is exceptional. Had an issue with my order and it was resolved within hours. Will definitely buy again.',
  },
  {
    name: 'Priya N.',
    role: 'IoT Developer',
    rating: 4,
    text: 'Great selection of components for my projects. Shipping was fast and every part was packaged with care.',
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
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
    <section className="py-20 md:py-28 px-4 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="What Customers Say"
          subtitle="Trusted by thousands of tech enthusiasts"
          gradient
          className="mb-12"
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
              className="glass rounded-2xl p-6 border border-border hover:border-accent/30 transition-colors duration-300 flex flex-col gap-4"
            >
              <Stars rating={t.rating} />
              <p className="text-text-secondary text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <Avatar name={t.name} />
                <div>
                  <p className="text-text-primary text-sm font-semibold">{t.name}</p>
                  <p className="text-text-muted text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
