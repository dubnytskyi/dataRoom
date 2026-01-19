export const VALIDATION = {
  MAX_NAME_LENGTH: 255,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_MIME_TYPES: ['application/pdf'] as const,
  INVALID_CHARS_REGEX: /[<>:"/\\|?*\x00-\x1F]/g,
} as const;
