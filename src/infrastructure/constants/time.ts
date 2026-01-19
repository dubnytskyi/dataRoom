export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

export const TIME_THRESHOLDS = {
  JUST_NOW: 60, // seconds
  MINUTES: 3600, // seconds (1 hour)
  HOURS: 86400, // seconds (1 day)
  DAYS: 604800, // seconds (1 week)
} as const;
