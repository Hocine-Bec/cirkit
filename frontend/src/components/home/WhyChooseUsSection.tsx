import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, Headphones } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import { staggerContainer, staggerItem } from '@/utils/animations';

const FEATURES = [
  {
    num: '01',
    icon: ShieldCheck,
    title: 'Genuine Products',
    desc: 'Every item is 100% authentic, sourced directly from authorized distributors.',
    color: '#3B82F6',
  },
  {
    num: '02',
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Next-day delivery available on thousands of products across the country.',
    color: '#8B5CF6',
  },
  {
    num: '03',
    icon: Clock,
    title: '2-Year Warranty',
    desc: 'Full manufacturer warranty on all products with hassle-free claims.',
    color: '#60A5FA',
  },
  {
    num: '04',
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Our tech experts are available around the clock to help you.',
    color: '#A78BFA',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-bg-secondary/30 section-glow">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Why CirKit"
          title="Why Choose Us"
          subtitle="Built for tech lovers, by tech lovers"
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
          {FEATURES.map(({ num, icon: Icon, title, desc, color }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="glass card-hover rounded-2xl p-6 border border-border hover:border-accent/30 group relative overflow-hidden"
            >
              {/* Background number */}
              <span
                className="absolute top-3 right-4 text-6xl font-bold font-mono leading-none select-none pointer-events-none transition-opacity duration-300 opacity-[0.06] group-hover:opacity-[0.1]"
                style={{ color }}
              >
                {num}
              </span>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}18` }}
              >
                <Icon size={22} style={{ color }} />
              </div>

              {/* Number label */}
              <p className="text-xs font-mono text-text-muted mb-2 tracking-widest">{num}</p>

              <h3 className="text-text-primary font-semibold text-lg mb-2">{title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{desc}</p>

              {/* Accent bottom border that grows on hover */}
              <div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(to right, ${color}80, transparent)` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
