import { cn } from '@/lib/utils';

interface NorifoodLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  variant?: 'light' | 'dark';
}

const sizeMap = {
  sm: { mark: 28, text: 'text-base', tagline: 'text-[8px]' },
  md: { mark: 40, text: 'text-xl', tagline: 'text-[9px]' },
  lg: { mark: 64, text: 'text-3xl', tagline: 'text-[11px]' },
  xl: { mark: 96, text: 'text-5xl', tagline: 'text-[13px]' },
};

export const NorifoodMark = ({ size = 40, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="nori-bowl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="46" fill="hsl(358 79% 51%)" />
    <path
      d="M 14 56 Q 30 78 50 78 Q 70 78 86 56 Z"
      fill="url(#nori-bowl)"
    />
    <path
      d="M 16 56 Q 30 64 50 64 Q 70 64 84 56"
      stroke="white"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* chopsticks */}
    <rect x="62" y="6" width="3.2" height="56" rx="1.2" fill="#f5f5f5" transform="rotate(18 63.6 34)" />
    <rect x="70" y="6" width="3.2" height="56" rx="1.2" fill="#dcdcdc" transform="rotate(18 71.6 34)" />
  </svg>
);

export const NorifoodLogo = ({
  className,
  size = 'md',
  showWordmark = true,
  showTagline = false,
  variant = 'light',
}: NorifoodLogoProps) => {
  const s = sizeMap[size];
  const textColor = variant === 'light' ? 'text-foreground' : 'text-black';
  const taglineColor = variant === 'light' ? 'text-muted-foreground' : 'text-neutral-600';

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <NorifoodMark size={s.mark} />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-extrabold tracking-tight', s.text, textColor)}>
            <span className={textColor}>NORI</span>
            <span className="text-primary">FOOD</span>
          </span>
          {showTagline && (
            <span className={cn('mt-1 font-semibold tracking-[0.25em] uppercase', s.tagline, taglineColor)}>
              Frozen · Asian · Sushi
            </span>
          )}
        </div>
      )}
    </div>
  );
};
