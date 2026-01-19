import { FileItem, ItemType, UploadFileDTO } from '../types';
import { VALIDATION } from '../constants/validation';

/**
 * Factory for creating File entities
 * Ensures all files are created with valid data
 */
export class FileFactory {
  /**
   * Create a new file with validation
   */
  static create(dto: UploadFileDTO): FileItem {
    const sanitizedName = this.sanitizeName(dto.name);
    this.validateName(sanitizedName);
    this.validateMimeType(dto.mimeType);
    this.validateSize(dto.size);

    return {
      id: crypto.randomUUID(),
      name: sanitizedName,
      parentId: dto.parentId,
      type: ItemType.FILE,
      size: dto.size,
      mimeType: dto.mimeType,
      data: dto.data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  /**
   * Sanitize file name
   */
  private static sanitizeName(name: string): string {
    return name
      .replace(VALIDATION.INVALID_CHARS_REGEX, '')
      .trim()
      .substring(0, VALIDATION.MAX_NAME_LENGTH);
  }

  /**
   * Validate file name
   */
  private static validateName(name: string): void {
    if (!name || name.length === 0) {
      throw new Error('File name cannot be empty');
    }

    if (name.length > VALIDATION.MAX_NAME_LENGTH) {
      throw new Error(`File name cannot exceed ${VALIDATION.MAX_NAME_LENGTH} characters`);
    }
  }

  /**
   * Validate MIME type
   */
  private static validateMimeType(mimeType: string): void {
    if (!VALIDATION.ALLOWED_MIME_TYPES.includes(mimeType as any)) {
      throw new Error(`Only PDF files are allowed. Received: ${mimeType}`);
    }
  }

  /**
   * Validate file size
   */
  private static validateSize(size: number): void {
    if (size <= 0) {
      throw new Error('File size must be greater than 0');
    }

    if (size > VALIDATION.MAX_FILE_SIZE) {
      throw new Error(
        `File size cannot exceed ${VALIDATION.MAX_FILE_SIZE / 1024 / 1024}MB. Received: ${
          size / 1024 / 1024
        }MB`
      );
    }
  }
}
