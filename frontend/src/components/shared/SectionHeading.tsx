import { cn } from '@/utils/cn';

interface Props {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  className?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ title, subtitle, gradient, className, align = 'center' }: Props) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      <h2 className={cn('text-3xl md:text-4xl font-bold tracking-tight', gradient && 'gradient-text')}>
        {title}
      </h2>
      {subtitle && <p className="text-text-secondary text-lg mt-2">{subtitle}</p>}
    </div>
  );
}
