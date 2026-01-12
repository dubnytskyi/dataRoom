import { FileItem, ItemType, UploadFileDTO } from '../types';

const MAX_NAME_LENGTH = 255;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = ['application/pdf'];
const INVALID_CHARS_REGEX = /[<>:"/\\|?*\x00-\x1F]/g;

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
      .replace(INVALID_CHARS_REGEX, '')
      .trim()
      .substring(0, MAX_NAME_LENGTH);
  }

  /**
   * Validate file name
   */
  private static validateName(name: string): void {
    if (!name || name.length === 0) {
      throw new Error('File name cannot be empty');
    }

    if (name.length > MAX_NAME_LENGTH) {
      throw new Error(`File name cannot exceed ${MAX_NAME_LENGTH} characters`);
    }
  }

  /**
   * Validate MIME type
   */
  private static validateMimeType(mimeType: string): void {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
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

    if (size > MAX_FILE_SIZE) {
      throw new Error(
        `File size cannot exceed ${MAX_FILE_SIZE / 1024 / 1024}MB. Received: ${
          size / 1024 / 1024
        }MB`
      );
    }
  }
}
