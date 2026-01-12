import { Folder, ItemType, CreateFolderDTO } from '../types';

const MAX_NAME_LENGTH = 255;
const INVALID_CHARS_REGEX = /[<>:"/\\|?*\x00-\x1F]/g;

/**
 * Factory for creating Folder entities
 * Ensures all folders are created with valid data
 */
export class FolderFactory {
  /**
   * Create a new folder with validation
   */
  static create(dto: CreateFolderDTO): Folder {
    const sanitizedName = this.sanitizeName(dto.name);
    this.validateName(sanitizedName);

    return {
      id: crypto.randomUUID(),
      name: sanitizedName,
      parentId: dto.parentId,
      type: ItemType.FOLDER,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  /**
   * Sanitize folder name
   */
  private static sanitizeName(name: string): string {
    return name
      .replace(INVALID_CHARS_REGEX, '')
      .trim()
      .substring(0, MAX_NAME_LENGTH);
  }

  /**
   * Validate folder name
   */
  private static validateName(name: string): void {
    if (!name || name.length === 0) {
      throw new Error('Folder name cannot be empty');
    }

    if (name.length > MAX_NAME_LENGTH) {
      throw new Error(`Folder name cannot exceed ${MAX_NAME_LENGTH} characters`);
    }
  }
}
