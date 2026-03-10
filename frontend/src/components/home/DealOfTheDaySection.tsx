import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Tag } from 'lucide-react';
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
    <div className="flex flex-col items-center">
      <div className="glass border border-border rounded-xl w-16 h-16 flex items-center justify-center font-mono text-2xl font-bold text-text-primary tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-text-muted text-xs mt-1 uppercase tracking-widest font-mono">{label}</span>
    </div>
  );
}

const DEAL = {
  name: 'Sony WH-1000XM5 Wireless Headphones',
  originalPrice: 399,
  discountPrice: 279,
  discount: 30,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
};

export default function DealOfTheDaySection() {
  const { hours, minutes, seconds } = useCountdown();
  const savings = DEAL.originalPrice - DEAL.discountPrice;

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Deal of the Day"
          subtitle="Limited time offer — don't miss out"
          gradient
          className="mb-12"
        />

        <motion.div
          className="glass rounded-3xl border border-border overflow-hidden grid md:grid-cols-2"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Left — product info */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1 w-fit mb-6">
              <Zap size={11} />
              Deal of the Day
            </span>

            <h3 className="text-text-primary text-2xl md:text-3xl font-bold leading-tight mb-4">
              {DEAL.name}
            </h3>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold gradient-text">${DEAL.discountPrice}</span>
              <span className="text-text-muted line-through text-xl">${DEAL.originalPrice}</span>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <Tag size={14} className="text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                You save ${savings} ({DEAL.discount}% off)
              </span>
            </div>

            <p className="text-text-muted text-xs uppercase tracking-widest font-mono mb-3">Ends in</p>
            <div className="flex items-center gap-3 mb-8">
              <TimeUnit value={hours}   label="hrs" />
              <span className="text-text-muted text-2xl font-bold pb-5">:</span>
              <TimeUnit value={minutes} label="min" />
              <span className="text-text-muted text-2xl font-bold pb-5">:</span>
              <TimeUnit value={seconds} label="sec" />
            </div>

            <Link to="/products" className="w-fit">
              <Button variant="primary" size="lg" className="glow-blue-hover">
                Grab the Deal
              </Button>
            </Link>
          </div>

          {/* Right — product image */}
          <div className="relative flex items-center justify-center bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 p-8 md:p-12 min-h-[300px]">
            <motion.img
              src={DEAL.image}
              alt={DEAL.name}
              className="w-full max-w-xs object-contain drop-shadow-2xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-accent flex items-center justify-center font-bold text-white text-sm font-mono shadow-lg shadow-accent/30">
              -{DEAL.discount}%
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
