import { DataRoomItem } from '../types';

/**
 * Repository interface for DataRoom storage operations
 * Follows Interface Segregation and Dependency Inversion principles
 */
export interface IDataRoomRepository {
  /**
   * Initialize the repository (e.g., open database connection)
   */
  init(): Promise<void>;

  /**
   * Get item by ID
   */
  getById(id: string): Promise<DataRoomItem | undefined>;

  /**
   * Get all items in a specific folder
   */
  getByParentId(parentId: string | null): Promise<DataRoomItem[]>;

  /**
   * Get all items (for search, etc.)
   */
  getAll(): Promise<DataRoomItem[]>;

  /**
   * Add new item
   */
  add(item: DataRoomItem): Promise<void>;

  /**
   * Update existing item
   */
  update(item: DataRoomItem): Promise<void>;

  /**
   * Delete item by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if item with same name exists in parent folder
   */
  checkDuplicateName(
    name: string,
    parentId: string | null,
    excludeId?: string
  ): Promise<boolean>;

  /**
   * Delete item and all its children recursively
   */
  deleteWithChildren(id: string): Promise<void>;
}
