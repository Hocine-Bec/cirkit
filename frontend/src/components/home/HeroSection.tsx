import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import GlitchText from '@/components/ui/GlitchText';
import MagneticButton from '@/components/ui/MagneticButton';
import HeroScene from '@/components/home/HeroScene';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-primary"
      onMouseMove={handleMouseMove}
    >
      {/* Aurora animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 800, height: 800,
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            top: -200, left: -200,
          }}
          animate={{ x: [0, 140, -80, 0], y: [0, -100, 80, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
            bottom: -100, right: -100,
          }}
          animate={{ x: [0, -120, 70, 0], y: [0, 80, -60, 0], scale: [1, 0.85, 1.15, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)',
            top: '35%', left: '45%',
          }}
          animate={{ x: [0, 60, -80, 0], y: [0, -50, 40, 0], scale: [1, 1.3, 0.85, 1] }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
        />
      </div>

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Cursor spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(59,130,246,0.07), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-text-muted text-sm uppercase tracking-[0.3em] mb-6 font-mono"
        >
          Welcome to the future of tech
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
        >
          <GlitchText className="text-7xl md:text-9xl font-bold tracking-tight">
            CirKit
          </GlitchText>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="text-text-secondary text-xl mt-4 max-w-xl"
        >
          Premium electronics. Unbeatable prices.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease }}
          className="flex items-center gap-4 mt-10"
        >
          <MagneticButton>
            <Link to="/products">
              <Button variant="primary" size="lg" className="glow-blue-hover">
                Shop Now
              </Button>
            </Link>
          </MagneticButton>
          <MagneticButton>
            <a href="#categories">
              <Button variant="secondary" size="lg">
                Explore Categories
              </Button>
            </a>
          </MagneticButton>
        </motion.div>

        {/* 3D scene */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="hidden md:block mt-10 w-72 h-72"
        >
          <HeroScene />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-text-muted"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
