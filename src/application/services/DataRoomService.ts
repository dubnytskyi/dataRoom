import { IDataRoomRepository } from '../../domain/repositories/IDataRoomRepository';
import {
  CreateFolderDTO,
  UploadFileDTO,
  RenameItemDTO,
  MoveItemDTO,
  OperationResult,
  DataRoomItem,
  SortConfig,
  SortBy,
  SortOrder,
  ItemType,
} from '../../domain/types';
import { FolderFactory } from '../../domain/entities/FolderFactory';
import { FileFactory } from '../../domain/entities/FileFactory';
import { ERROR_MESSAGES, UI_TEXT } from '../../presentation/constants/messages';

/**
 * Main service for DataRoom operations
 * Contains business logic and orchestrates repository calls
 * Follows Single Responsibility Principle
 */
export class DataRoomService {
  constructor(private repository: IDataRoomRepository) {}

  /**
   * Create a new folder
   */
  async createFolder(dto: CreateFolderDTO): Promise<OperationResult> {
    try {
      // Check for duplicate name
      const isDuplicate = await this.repository.checkDuplicateName(dto.name, dto.parentId);

      if (isDuplicate) {
        return {
          success: false,
          message: ERROR_MESSAGES.DUPLICATE_FOLDER,
        };
      }

      // Create folder using factory
      const folder = FolderFactory.create(dto);

      // Save to repository
      await this.repository.add(folder);

      return {
        success: true,
        data: folder,
      };
    } catch (error) {
      console.error('DataRoomService: error creating folder:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_CREATE_FOLDER,
      };
    }
  }

  /**
   * Upload a new file
   */
  async uploadFile(dto: UploadFileDTO): Promise<OperationResult> {
    try {
      // Check for duplicate name
      const isDuplicate = await this.repository.checkDuplicateName(dto.name, dto.parentId);
      if (isDuplicate) {
        return {
          success: false,
          message: ERROR_MESSAGES.DUPLICATE_FILE,
        };
      }

      // Create file using factory (includes validation)
      const file = FileFactory.create(dto);

      // Save to repository
      await this.repository.add(file);

      return {
        success: true,
        data: file,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_UPLOAD,
      };
    }
  }

  /**
   * Rename an item (folder or file)
   */
  async renameItem(dto: RenameItemDTO): Promise<OperationResult> {
    try {
      // Get the item
      const item = await this.repository.getById(dto.id);
      if (!item) {
        return {
          success: false,
          message: ERROR_MESSAGES.ITEM_NOT_FOUND,
        };
      }

      // Check for duplicate name
      const isDuplicate = await this.repository.checkDuplicateName(
        dto.newName,
        item.parentId,
        dto.id
      );
      if (isDuplicate) {
        return {
          success: false,
          message: ERROR_MESSAGES.DUPLICATE_ITEM,
        };
      }

      // Update item
      const updatedItem = {
        ...item,
        name: dto.newName,
        updatedAt: Date.now(),
      };

      await this.repository.update(updatedItem);

      return {
        success: true,
        data: updatedItem,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_RENAME,
      };
    }
  }

  /**
   * Move an item to a different parent folder
   */
  async moveItem(dto: MoveItemDTO): Promise<OperationResult> {
    try {
      // Get the item to move
      const item = await this.repository.getById(dto.id);
      if (!item) {
        return {
          success: false,
          message: ERROR_MESSAGES.ITEM_NOT_FOUND,
        };
      }

      // Can't move item into itself (if it's a folder)
      if (item.type === ItemType.FOLDER && dto.newParentId === dto.id) {
        return {
          success: false,
          message: ERROR_MESSAGES.MOVE_INTO_ITSELF,
        };
      }

      // Check if moving into a descendant folder (would create a cycle)
      if (item.type === ItemType.FOLDER && dto.newParentId) {
        const isDescendant = await this.isDescendantFolder(dto.id, dto.newParentId);
        if (isDescendant) {
          return {
            success: false,
            message: ERROR_MESSAGES.MOVE_INTO_SUBFOLDER,
          };
        }
      }

      // Check for duplicate name in target location
      const isDuplicate = await this.repository.checkDuplicateName(
        item.name,
        dto.newParentId,
        dto.id
      );
      if (isDuplicate) {
        return {
          success: false,
          message: ERROR_MESSAGES.ITEM_IN_TARGET,
        };
      }

      // Update item's parentId
      const updatedItem = {
        ...item,
        parentId: dto.newParentId,
        updatedAt: Date.now(),
      };

      await this.repository.update(updatedItem);

      return {
        success: true,
        data: updatedItem,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_MOVE,
      };
    }
  }

  /**
   * Check if targetFolderId is a descendant of sourceFolderId
   */
  private async isDescendantFolder(
    sourceFolderId: string,
    targetFolderId: string
  ): Promise<boolean> {
    let currentId: string | null = targetFolderId;

    while (currentId) {
      if (currentId === sourceFolderId) {
        return true;
      }

      const folder = await this.repository.getById(currentId);
      if (!folder) break;

      currentId = folder.parentId;
    }

    return false;
  }

  /**
   * Delete an item (and its children if it's a folder)
   */
  async deleteItem(id: string): Promise<OperationResult> {
    try {
      await this.repository.deleteWithChildren(id);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_DELETE,
      };
    }
  }

  /**
   * Get items in a folder
   */
  async getItems(parentId: string | null): Promise<DataRoomItem[]> {
    return this.repository.getByParentId(parentId);
  }

  /**
   * Get item by ID
   */
  async getItem(id: string): Promise<DataRoomItem | undefined> {
    return this.repository.getById(id);
  }

  /**
   * Get all folders (for folder picker)
   */
  async getAllFolders(): Promise<DataRoomItem[]> {
    const allItems = await this.repository.getAll();
    return allItems.filter(item => item.type === ItemType.FOLDER);
  }

  /**
   * Sort items by given configuration
   */
  sortItems(items: DataRoomItem[], config: SortConfig): DataRoomItem[] {
    const sorted = [...items].sort((a, b) => {
      // Folders always come first
      if (a.type === ItemType.FOLDER && b.type === ItemType.FILE) return -1;
      if (a.type === ItemType.FILE && b.type === ItemType.FOLDER) return 1;

      let comparison = 0;

      switch (config.sortBy) {
        case SortBy.NAME:
          comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
          break;
        case SortBy.DATE:
          comparison = a.updatedAt - b.updatedAt;
          break;
        case SortBy.SIZE:
          const aSize = a.type === ItemType.FILE ? a.size : 0;
          const bSize = b.type === ItemType.FILE ? b.size : 0;
          comparison = aSize - bSize;
          break;
      }

      return config.sortOrder === SortOrder.ASC ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * Build breadcrumb path for current folder
   */
  async getBreadcrumbs(folderId: string | null): Promise<Array<{ id: string | null; name: string }>> {
    const breadcrumbs: Array<{ id: string | null; name: string }> = [
      { id: null, name: UI_TEXT.BREADCRUMBS.ROOT },
    ];

    if (!folderId) return breadcrumbs;

    let currentId: string | null = folderId;
    const path: Array<{ id: string; name: string }> = [];

    while (currentId) {
      const item = await this.repository.getById(currentId);
      if (!item || item.type !== ItemType.FOLDER) break;
      path.unshift({ id: item.id, name: item.name });
      currentId = item.parentId;
    }

    return [...breadcrumbs, ...path];
  }
}
