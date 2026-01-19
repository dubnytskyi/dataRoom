import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FileFactory } from './FileFactory';
import { ItemType } from '../types';
import { VALIDATION } from '../constants/validation';

describe('FileFactory', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('987fcdeb-51a2-43c7-b789-123456789abc' as `${string}-${string}-${string}-${string}-${string}`);
    vi.spyOn(Date, 'now').mockReturnValue(9876543210);
  });

  describe('create', () => {
    it('creates a file with valid data', () => {
      const file = FileFactory.create({
        name: 'document.pdf',
        parentId: null,
        size: 1024,
        mimeType: 'application/pdf',
        data: 'base64-data',
      });

      expect(file).toEqual({
        id: '987fcdeb-51a2-43c7-b789-123456789abc',
        name: 'document.pdf',
        parentId: null,
        type: ItemType.FILE,
        size: 1024,
        mimeType: 'application/pdf',
        data: 'base64-data',
        createdAt: 9876543210,
        updatedAt: 9876543210,
      });
    });

    it('sanitizes file name by removing invalid characters', () => {
      const file = FileFactory.create({
        name: 'my<file>name.pdf',
        parentId: null,
        size: 1024,
        mimeType: 'application/pdf',
        data: 'base64-data',
      });

      expect(file.name).toBe('myfilename.pdf');
    });

    it('throws error for empty file name', () => {
      expect(() => {
        FileFactory.create({
          name: '',
          parentId: null,
          size: 1024,
          mimeType: 'application/pdf',
          data: 'base64-data',
        });
      }).toThrow('File name cannot be empty');
    });

    it('throws error for non-PDF mime type', () => {
      expect(() => {
        FileFactory.create({
          name: 'document.txt',
          parentId: null,
          size: 1024,
          mimeType: 'text/plain',
          data: 'base64-data',
        });
      }).toThrow('Only PDF files are allowed');
    });

    it('throws error for file size <= 0', () => {
      expect(() => {
        FileFactory.create({
          name: 'document.pdf',
          parentId: null,
          size: 0,
          mimeType: 'application/pdf',
          data: 'base64-data',
        });
      }).toThrow('File size must be greater than 0');
    });

    it('throws error for file size exceeding 50MB', () => {
      expect(() => {
        FileFactory.create({
          name: 'document.pdf',
          parentId: null,
          size: VALIDATION.MAX_FILE_SIZE + 1,
          mimeType: 'application/pdf',
          data: 'base64-data',
        });
      }).toThrow('File size cannot exceed 50MB');
    });

    it('accepts file with parentId', () => {
      const file = FileFactory.create({
        name: 'document.pdf',
        parentId: 'parent-folder-123',
        size: 1024,
        mimeType: 'application/pdf',
        data: 'base64-data',
      });

      expect(file.parentId).toBe('parent-folder-123');
    });

    it('truncates file name to max length', () => {
      const longName = 'a'.repeat(300) + '.pdf';
      const file = FileFactory.create({
        name: longName,
        parentId: null,
        size: 1024,
        mimeType: 'application/pdf',
        data: 'base64-data',
      });

      expect(file.name.length).toBeLessThanOrEqual(VALIDATION.MAX_NAME_LENGTH);
    });
  });
});
