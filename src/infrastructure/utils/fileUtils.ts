import { ERROR_MESSAGES } from '../../presentation/constants/messages';
import { TIME_THRESHOLDS } from '../constants/time';

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Read file as base64 data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error(ERROR_MESSAGES.FAILED_READ_FILE));
    reader.readAsDataURL(file);
  });
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Validate if file is PDF
 */
export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf' || getFileExtension(file.name) === 'pdf';
}

/**
 * Format date to readable string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than 1 minute
  if (diffInSeconds < TIME_THRESHOLDS.JUST_NOW) {
    return 'Just now';
  }

  // Less than 1 hour
  if (diffInSeconds < TIME_THRESHOLDS.MINUTES) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  // Less than 1 day
  if (diffInSeconds < TIME_THRESHOLDS.HOURS) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  // Less than 1 week
  if (diffInSeconds < TIME_THRESHOLDS.DAYS) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  // Format as date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
