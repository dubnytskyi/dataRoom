import { Folder, ItemType, CreateFolderDTO } from '../types';
import { VALIDATION } from '../constants/validation';

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
      .replace(VALIDATION.INVALID_CHARS_REGEX, '')
      .trim()
      .substring(0, VALIDATION.MAX_NAME_LENGTH);
  }

  /**
   * Validate folder name
   */
  private static validateName(name: string): void {
    if (!name || name.length === 0) {
      throw new Error('Folder name cannot be empty');
    }

    if (name.length > VALIDATION.MAX_NAME_LENGTH) {
      throw new Error(`Folder name cannot exceed ${VALIDATION.MAX_NAME_LENGTH} characters`);
    }
  }
}
