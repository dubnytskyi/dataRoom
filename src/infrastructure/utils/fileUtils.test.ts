import { describe, it, expect } from 'vitest';
import { formatFileSize, getFileExtension, isPDFFile, formatDate } from './fileUtils';
import { TIME } from '../constants/time';

describe('fileUtils', () => {
  describe('formatFileSize', () => {
    it('formats 0 bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('formats bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(5242880)).toBe('5 MB');
    });

    it('formats gigabytes correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('getFileExtension', () => {
    it('extracts extension from filename', () => {
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('image.PNG')).toBe('png');
    });

    it('handles files with multiple dots', () => {
      expect(getFileExtension('my.document.pdf')).toBe('pdf');
    });

    it('returns empty string for files without extension', () => {
      expect(getFileExtension('filename')).toBe('');
    });

    it('handles empty string', () => {
      expect(getFileExtension('')).toBe('');
    });
  });

  describe('isPDFFile', () => {
    it('returns true for PDF mime type', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      expect(isPDFFile(file)).toBe(true);
    });

    it('returns true for .pdf extension even without mime type', () => {
      const file = new File([''], 'test.pdf', { type: '' });
      expect(isPDFFile(file)).toBe(true);
    });

    it('returns false for non-PDF files', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      expect(isPDFFile(file)).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('returns "Just now" for recent timestamps', () => {
      const now = Date.now();
      expect(formatDate(now - 30 * TIME.SECOND)).toBe('Just now');
    });

    it('formats minutes ago correctly', () => {
      const now = Date.now();
      expect(formatDate(now - 5 * TIME.MINUTE)).toBe('5 minutes ago');
      expect(formatDate(now - 1 * TIME.MINUTE)).toBe('1 minute ago');
    });

    it('formats hours ago correctly', () => {
      const now = Date.now();
      expect(formatDate(now - 3 * TIME.HOUR)).toBe('3 hours ago');
      expect(formatDate(now - 1 * TIME.HOUR)).toBe('1 hour ago');
    });

    it('formats days ago correctly', () => {
      const now = Date.now();
      expect(formatDate(now - 2 * TIME.DAY)).toBe('2 days ago');
      expect(formatDate(now - 1 * TIME.DAY)).toBe('1 day ago');
    });

    it('formats older dates as locale date string', () => {
      const now = Date.now();
      const oldDate = now - 2 * TIME.WEEK;
      const formatted = formatDate(oldDate);

      // Should not be relative time format
      expect(formatted).not.toContain('ago');
      expect(formatted).not.toBe('Just now');
    });
  });
});
