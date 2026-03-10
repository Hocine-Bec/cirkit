import { cn } from '@/utils/cn';

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  gradient?: boolean;
  className?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ title, subtitle, eyebrow, gradient, className, align = 'center' }: Props) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      {eyebrow && (
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-accent mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className={cn('text-4xl md:text-5xl font-bold', gradient && 'gradient-text')}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-lg mt-3 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
