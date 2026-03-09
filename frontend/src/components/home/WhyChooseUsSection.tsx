import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, Headphones } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import { staggerContainer, staggerItem } from '@/utils/animations';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Genuine Products',
    desc: 'Every item is 100% authentic, sourced directly from authorized distributors.',
    color: '#3B82F6',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Next-day delivery available on thousands of products across the country.',
    color: '#8B5CF6',
  },
  {
    icon: Clock,
    title: '2-Year Warranty',
    desc: 'Full manufacturer warranty on all products with hassle-free claims.',
    color: '#60A5FA',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Our tech experts are available around the clock to help you.',
    color: '#A78BFA',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Why Choose Us"
          subtitle="Built for tech lovers, by tech lovers"
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
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="glass rounded-2xl p-6 border border-border hover:border-accent/30 transition-colors duration-300 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}18` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="text-text-primary font-semibold text-lg mb-2">{title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
