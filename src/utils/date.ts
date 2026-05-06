/** Number of whole days since the Unix epoch in the local timezone. */
export const epochDay = (date: Date = new Date()): number => {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local.getTime() / (1000 * 60 * 60 * 24));
};

export const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

export const formatRemaining = (ms: number, hLabel: string, mLabel: string): string => {
  if (ms <= 0) return `0${hLabel} 00${mLabel}`;
  const totalMinutes = Math.ceil(ms / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}${hLabel} ${minutes.toString().padStart(2, '0')}${mLabel}`;
};
