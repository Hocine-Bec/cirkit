import { cn } from '@/utils/cn';

interface Props {
  children: string;
  className?: string;
}

export default function GlitchText({ children, className }: Props) {
  return (
    <span
      className={cn('glitch-text gradient-text', className)}
      data-text={children}
    >
      {children}
    </span>
  );
}
