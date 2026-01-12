import { ItemType, SortBy, SortOrder } from './enums';

export * from './enums';

export interface BaseItem {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  parentId: string | null;
  type: ItemType;
}

export interface Folder extends BaseItem {
  type: ItemType.FOLDER;
}

export interface FileItem extends BaseItem {
  type: ItemType.FILE;
  size: number;
  mimeType: string;
  data: string; // Base64 encoded file data
}

export type DataRoomItem = Folder | FileItem;

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export interface SortConfig {
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface CreateFolderDTO {
  name: string;
  parentId: string | null;
}

export interface UploadFileDTO {
  name: string;
  parentId: string | null;
  size: number;
  mimeType: string;
  data: string;
}

export interface RenameItemDTO {
  id: string;
  newName: string;
}

export interface MoveItemDTO {
  id: string;
  newParentId: string | null;
}

export interface OperationResult {
  success: boolean;
  message?: string;
  data?: any;
}
