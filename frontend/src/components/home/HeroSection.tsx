import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import GlitchText from '@/components/ui/GlitchText';
import MagneticButton from '@/components/ui/MagneticButton';
import HeroScene from '@/components/home/HeroScene';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const MINI_STATS = [
  { value: '500+', label: 'Products' },
  { value: '50+',  label: 'Brands'   },
  { value: '25K+', label: 'Customers' },
];

export default function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-bg-primary pt-16"
      onMouseMove={handleMouseMove}
    >
      {/* Aurora animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 900, height: 900,
            background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)',
            top: -300, left: -300,
          }}
          animate={{ x: [0, 140, -80, 0], y: [0, -100, 80, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 700, height: 700,
            background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)',
            bottom: -200, right: -100,
          }}
          animate={{ x: [0, -120, 70, 0], y: [0, 80, -60, 0], scale: [1, 0.85, 1.15, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)',
            top: '40%', right: '15%',
          }}
          animate={{ x: [0, 60, -80, 0], y: [0, -50, 40, 0], scale: [1, 1.3, 0.85, 1] }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
        />
      </div>

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.25) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Cursor spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(59,130,246,0.06), transparent 40%)`,
        }}
      />

      {/* Main content — two-column on desktop */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-0 grid md:grid-cols-2 gap-12 md:gap-8 items-center">

        {/* Left column — copy */}
        <div className="flex flex-col items-start text-left">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-accent bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Premium Tech Store
          </motion.div>

          {/* Brand name + tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mb-6"
          >
            <GlitchText className="text-8xl md:text-9xl font-bold tracking-tight leading-none block">
              CirKit
            </GlitchText>
            <h1 className="text-3xl md:text-4xl font-semibold text-text-secondary mt-4 leading-snug">
              The Future of{' '}
              <span className="gradient-text">Tech Shopping</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
            className="text-text-muted text-lg leading-relaxed mb-10 max-w-md"
          >
            From flagship laptops to smart home gear — curated for enthusiasts,
            priced for everyone.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="flex items-center gap-4 mb-14"
          >
            <MagneticButton>
              <Link to="/products">
                <Button variant="primary" size="lg" className="glow-blue-hover">
                  Shop Now <ArrowRight size={16} />
                </Button>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a href="#categories">
                <Button variant="secondary" size="lg">
                  Browse Categories
                </Button>
              </a>
            </MagneticButton>
          </motion.div>

          {/* Mini stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
            className="flex items-center"
          >
            {MINI_STATS.map(({ value, label }, i) => (
              <div key={label} className="flex items-center">
                {i > 0 && <div className="w-px h-8 bg-border mx-7" />}
                <div>
                  <p className="text-xl font-bold text-text-primary font-mono leading-none">{value}</p>
                  <p className="text-xs text-text-muted uppercase tracking-widest mt-1">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column — 3D scene with floating cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="relative flex items-center justify-center"
        >
          {/* Glow rings */}
          <div className="absolute w-80 h-80 md:w-[420px] md:h-[420px] rounded-full border border-accent/8" />
          <div className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full border border-accent/14" />

          {/* 3D scene */}
          <div className="w-72 h-72 md:w-96 md:h-96">
            <HeroScene />
          </div>

          {/* Floating product badge — upper right */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 -right-2 md:-right-6 glass border border-border rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Package size={14} className="text-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary whitespace-nowrap">500+ Products</p>
              <p className="text-xs text-text-muted">In stock now</p>
            </div>
          </motion.div>

          {/* Floating rating badge — lower left */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="absolute bottom-10 -left-2 md:-left-6 glass border border-border rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary whitespace-nowrap">4.8★ Rating</p>
              <p className="text-xs text-text-muted">25K+ reviews</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-text-muted"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-text-muted/60 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}
