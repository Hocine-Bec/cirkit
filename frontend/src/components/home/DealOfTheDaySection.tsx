import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionHeading from '@/components/shared/SectionHeading';

function useCountdown() {
  const getTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16 rounded-xl border border-accent/30 bg-accent/8 flex items-center justify-center overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
        <span className="font-mono text-2xl font-bold text-text-primary tabular-nums relative z-10">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-mono">{label}</span>
    </div>
  );
}

const DEAL = {
  name: 'MacBook Air 15" — M3 Chip',
  originalPrice: 1299,
  discountPrice: 999,
  discount: 23,
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=85',
  features: ['Apple M3 chip with 10-core GPU', '18-hour battery life', '15.3" Liquid Retina display'],
};

export default function DealOfTheDaySection() {
  const { hours, minutes, seconds } = useCountdown();
  const savings = DEAL.originalPrice - DEAL.discountPrice;

  return (
    <section className="relative py-20 md:py-28 px-4 section-glow">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Flash Sale"
          title="Deal of the Day"
          subtitle="Limited time offer — don't miss out"
          gradient
          className="mb-12"
        />

        <motion.div
          className="relative rounded-3xl border border-border overflow-hidden grid md:grid-cols-2"
          style={{ background: 'rgba(26,26,26,0.5)', backdropFilter: 'blur(12px)' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Accent top border line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          {/* Left — product info */}
          <div className="p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border/50">

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-bold gradient-text">${DEAL.discountPrice}</span>
              <span className="text-text-muted line-through text-2xl">${DEAL.originalPrice}</span>
            </div>

            {/* Savings badge */}
            <div className="flex items-center gap-2 mb-6">
              <Tag size={13} className="text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                You save ${savings} ({DEAL.discount}% off)
              </span>
            </div>

            <h3 className="text-text-primary text-2xl md:text-3xl font-bold leading-tight mb-5">
              {DEAL.name}
            </h3>

            {/* Feature bullets */}
            <ul className="flex flex-col gap-2 mb-8">
              {DEAL.features.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Countdown */}
            <p className="text-text-muted text-[10px] uppercase tracking-[0.25em] font-mono mb-3">
              Offer ends in
            </p>
            <div className="flex items-end gap-2 mb-8">
              <TimeUnit value={hours}   label="hrs" />
              <span className="text-text-muted text-xl font-bold mb-6 leading-none">:</span>
              <TimeUnit value={minutes} label="min" />
              <span className="text-text-muted text-xl font-bold mb-6 leading-none">:</span>
              <TimeUnit value={seconds} label="sec" />
            </div>

            <Link to="/products" className="w-fit">
              <Button variant="primary" size="lg" className="glow-blue-hover">
                Grab the Deal
              </Button>
            </Link>
          </div>

          {/* Right — product image, full-bleed photo panel */}
          <div className="relative min-h-[360px] md:min-h-0 overflow-hidden">
            <img
              src={DEAL.image}
              alt={DEAL.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Left-edge fade into the card */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#1a1a1a80] to-transparent pointer-events-none" />
            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1a1a1a60] to-transparent pointer-events-none" />

            {/* Discount pill */}
            <div className="absolute top-5 right-5 bg-accent rounded-2xl px-3 py-1.5 flex flex-col items-center shadow-lg shadow-accent/40 z-10">
              <span className="text-white font-mono font-bold text-lg leading-none">-{DEAL.discount}%</span>
              <span className="text-white/70 text-[10px] font-mono uppercase tracking-wider">off</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
