import { cn } from '@/lib/utils';
import logoSrc from '@/assets/norifood-logo.png';

interface NorifoodLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Kept for backward compatibility — the PNG asset always includes the wordmark + tagline. */
  showWordmark?: boolean;
  showTagline?: boolean;
}

const heightMap = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-14',
  xl: 'h-20',
};

export const NorifoodLogo = ({ className, size = 'md' }: NorifoodLogoProps) => {
  return (
    <img
      src={logoSrc}
      alt="Norifood — Frozen · Asian · Sushi"
      className={cn(heightMap[size], 'w-auto select-none', className)}
      draggable={false}
    />
  );
};

/** Compact icon-only mark for tight spaces (favicon-style). */
export const NorifoodMark = ({ size = 40, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="hsl(358 79% 51%)" />
    <path d="M 14 56 Q 30 78 50 78 Q 70 78 86 56 Z" fill="#0a0a0a" />
    <path
      d="M 16 56 Q 30 64 50 64 Q 70 64 84 56"
      stroke="white"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <rect x="62" y="6" width="3.2" height="56" rx="1.2" fill="#f5f5f5" transform="rotate(18 63.6 34)" />
    <rect x="70" y="6" width="3.2" height="56" rx="1.2" fill="#dcdcdc" transform="rotate(18 71.6 34)" />
  </svg>
);
