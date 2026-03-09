import { motion } from 'framer-motion';

interface Props {
  flip?: boolean;
}

export default function CircuitDivider({ flip = false }: Props) {
  return (
    <div
      className="relative w-full h-16 overflow-hidden opacity-20 select-none pointer-events-none"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <svg
        viewBox="0 0 1200 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Main horizontal trace */}
        <line x1="0"    y1="32" x2="160"  y2="32" stroke="#3B82F6" strokeWidth="1" />

        {/* Branch up-left */}
        <polyline points="160,32 160,12 260,12 260,32" stroke="#3B82F6" strokeWidth="1" fill="none" />
        <circle cx="160" cy="12" r="3" fill="#3B82F6" />
        <circle cx="260" cy="12" r="3" fill="#3B82F6" />
        {/* SMD resistor symbol */}
        <rect x="193" y="8" width="34" height="8" stroke="#3B82F6" strokeWidth="1" fill="rgba(59,130,246,0.08)" rx="1" />

        <line x1="260" y1="32" x2="380" y2="32" stroke="#3B82F6" strokeWidth="1" />

        {/* Via dot */}
        <circle cx="380" cy="32" r="4" fill="none" stroke="#3B82F6" strokeWidth="1" />
        <circle cx="380" cy="32" r="1.5" fill="#3B82F6" />

        <line x1="384" y1="32" x2="520" y2="32" stroke="#3B82F6" strokeWidth="1" />

        {/* Branch down */}
        <polyline points="520,32 520,52 620,52 620,32" stroke="#8B5CF6" strokeWidth="1" fill="none" />
        <circle cx="520" cy="52" r="3" fill="#8B5CF6" />
        <circle cx="620" cy="52" r="3" fill="#8B5CF6" />
        {/* SMD cap symbol */}
        <line x1="565" y1="48" x2="565" y2="56" stroke="#8B5CF6" strokeWidth="1.5" />
        <line x1="571" y1="48" x2="571" y2="56" stroke="#8B5CF6" strokeWidth="1.5" />

        <line x1="620" y1="32" x2="760" y2="32" stroke="#3B82F6" strokeWidth="1" />

        {/* IC package */}
        <rect x="760" y="20" width="72" height="24" stroke="#3B82F6" strokeWidth="1" fill="rgba(59,130,246,0.06)" rx="2" />
        {/* IC pins top */}
        <line x1="774" y1="20" x2="774" y2="12" stroke="#3B82F6" strokeWidth="1" />
        <line x1="792" y1="20" x2="792" y2="12" stroke="#3B82F6" strokeWidth="1" />
        <line x1="810" y1="20" x2="810" y2="12" stroke="#3B82F6" strokeWidth="1" />
        {/* IC pins bottom */}
        <line x1="774" y1="44" x2="774" y2="52" stroke="#3B82F6" strokeWidth="1" />
        <line x1="792" y1="44" x2="792" y2="52" stroke="#3B82F6" strokeWidth="1" />
        <line x1="810" y1="44" x2="810" y2="52" stroke="#3B82F6" strokeWidth="1" />

        <line x1="832" y1="32" x2="980" y2="32" stroke="#3B82F6" strokeWidth="1" />

        {/* Branch up-right */}
        <polyline points="980,32 980,12 1080,12 1080,32" stroke="#60A5FA" strokeWidth="1" fill="none" />
        <circle cx="980"  cy="12" r="3" fill="#60A5FA" />
        <circle cx="1080" cy="12" r="3" fill="#60A5FA" />
        {/* LED symbol */}
        <circle cx="1030" cy="12" r="5" fill="none" stroke="#60A5FA" strokeWidth="1" />
        <circle cx="1030" cy="12" r="2" fill="#60A5FA" opacity="0.6" />

        <line x1="1080" y1="32" x2="1200" y2="32" stroke="#3B82F6" strokeWidth="1" />

        {/* Animated signal dot */}
        <motion.circle
          r="3"
          fill="#3B82F6"
          animate={{ cx: [0, 1200] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          cy="32"
          opacity={0.9}
        />
      </svg>
    </div>
  );
}
