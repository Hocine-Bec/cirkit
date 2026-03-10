import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <section className="relative py-32 md:py-40 px-4 overflow-hidden">
      {/* Cinematic glow backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-accent/8 to-bg-primary pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-accent-secondary/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-6"
        >
          <Zap size={11} />
          Exclusive Access
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold gradient-text leading-none mb-6"
        >
          Never Miss a Drop
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-secondary text-lg leading-relaxed mb-10"
        >
          Get notified about new arrivals, exclusive deals, and tech releases
          before anyone else.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
            className="flex-1 px-5 py-3.5 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
          <Button variant="primary" size="lg" onClick={handleSubscribe} className="glow-blue-hover whitespace-nowrap">
            Subscribe
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-text-muted text-xs mt-4 font-mono"
        >
          No spam. Unsubscribe anytime. · Join{' '}
          <span className="text-text-secondary">25,000+</span> subscribers
        </motion.p>
      </div>
    </section>
  );
}
