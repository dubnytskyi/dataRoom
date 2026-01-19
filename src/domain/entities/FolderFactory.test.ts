import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FolderFactory } from './FolderFactory';
import { ItemType } from '../types';
import { VALIDATION } from '../constants/validation';

describe('FolderFactory', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('123e4567-e89b-12d3-a456-426614174000' as `${string}-${string}-${string}-${string}-${string}`);
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  describe('create', () => {
    it('creates a folder with valid data', () => {
      const folder = FolderFactory.create({
        name: 'My Folder',
        parentId: null,
      });

      expect(folder).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My Folder',
        parentId: null,
        type: ItemType.FOLDER,
        createdAt: 1234567890,
        updatedAt: 1234567890,
      });
    });

    it('sanitizes folder name by removing invalid characters', () => {
      const folder = FolderFactory.create({
        name: 'My<Folder>Name',
        parentId: null,
      });

      expect(folder.name).toBe('MyFolderName');
    });

    it('trims whitespace from folder name', () => {
      const folder = FolderFactory.create({
        name: '  My Folder  ',
        parentId: null,
      });

      expect(folder.name).toBe('My Folder');
    });

    it('throws error for empty folder name', () => {
      expect(() => {
        FolderFactory.create({
          name: '',
          parentId: null,
        });
      }).toThrow('Folder name cannot be empty');
    });

    it('throws error for folder name with only invalid characters', () => {
      expect(() => {
        FolderFactory.create({
          name: '<>:"/\\|?*',
          parentId: null,
        });
      }).toThrow('Folder name cannot be empty');
    });

    it('truncates folder name to max length', () => {
      const longName = 'a'.repeat(300);
      const folder = FolderFactory.create({
        name: longName,
        parentId: null,
      });

      expect(folder.name.length).toBe(VALIDATION.MAX_NAME_LENGTH);
    });

    it('creates folder with parentId', () => {
      const folder = FolderFactory.create({
        name: 'Subfolder',
        parentId: 'parent-id-123',
      });

      expect(folder.parentId).toBe('parent-id-123');
    });
  });
});
