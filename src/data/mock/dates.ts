export function daysAgoIso(days: number, now: Date = new Date()): string {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(10, 0, 0, 0);
  return date.toISOString();
}
