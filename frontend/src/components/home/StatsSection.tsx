import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Package, Users, Award, Star } from 'lucide-react';

const stats = [
  { value: 500,   suffix: '+',  label: 'Products',       icon: Package, decimals: 0 },
  { value: 50,    suffix: '+',  label: 'Top Brands',      icon: Award,   decimals: 0 },
  { value: 25000, suffix: '+',  label: 'Happy Customers', icon: Users,   decimals: 0 },
  { value: 4.8,   suffix: '★', label: 'Average Rating',  icon: Star,    decimals: 1 },
];

function Counter({
  value,
  suffix,
  decimals,
}: {
  value: number;
  suffix: string;
  decimals: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  const formatted =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="font-mono">
      {formatted}{suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* subtle background rule */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {stats.map(({ value, suffix, label, icon: Icon, decimals }) => (
            <motion.div
              key={label}
              variants={{
                hidden:   { opacity: 0, y: 24 },
                visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="glass rounded-2xl p-6 text-center border border-border hover:border-accent/30 transition-colors duration-300 group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <Icon size={18} className="text-accent" />
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary">
                <Counter value={value} suffix={suffix} decimals={decimals} />
              </p>
              <p className="text-text-muted text-sm mt-1 uppercase tracking-wider font-mono">
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
