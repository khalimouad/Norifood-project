/**
 * Format a numeric value as a fixed-decimal string. Returns the fallback
 * (default '0.00') when the value is null, undefined, or NaN — guards
 * the entire UI against `(undefined).toFixed()` runtime crashes when a
 * row from Supabase is missing a price/total/etc.
 */
export const formatPrice = (
  value: number | string | null | undefined,
  fractionDigits = 2,
  fallback = '0.00',
): string => {
  if (value === null || value === undefined || value === '') return fallback;
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return n.toFixed(fractionDigits);
};

/** Same idea but returns a number (for math). */
export const safeNumber = (
  value: number | string | null | undefined,
  fallback = 0,
): number => {
  if (value === null || value === undefined || value === '') return fallback;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
};
