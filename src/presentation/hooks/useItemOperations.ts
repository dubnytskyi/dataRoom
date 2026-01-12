import { toast } from 'sonner';
import {
  CreateFolderDTO,
  RenameItemDTO,
  MoveItemDTO,
  DataRoomItem,
  ItemType,
} from '../../domain/types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/messages';

interface UseItemOperationsProps {
  createFolder: (dto: CreateFolderDTO) => Promise<{ success: boolean; message?: string }>;
  renameItem: (dto: RenameItemDTO) => Promise<{ success: boolean; message?: string }>;
  deleteItem: (id: string) => Promise<{ success: boolean; message?: string }>;
  moveItem: (dto: MoveItemDTO) => Promise<{ success: boolean; message?: string }>;
  navigateToFolder: (folderId: string | null) => Promise<void>;
}

export const useItemOperations = ({
  createFolder,
  renameItem,
  deleteItem,
  moveItem,
  navigateToFolder,
}: UseItemOperationsProps) => {
  const handleCreateFolder = async (name: string, parentId: string | null) => {
    const result = await createFolder({ name, parentId });

    if (result.success) {
      toast.success(SUCCESS_MESSAGES.FOLDER_CREATED);
      return true;
    } else {
      toast.error(result.message || ERROR_MESSAGES.FAILED_CREATE_FOLDER);
      return false;
    }
  };

  const handleRename = async (id: string, newName: string) => {
    const result = await renameItem({ id, newName });

    if (result.success) {
      toast.success(SUCCESS_MESSAGES.ITEM_RENAMED);
      return true;
    } else {
      toast.error(result.message || ERROR_MESSAGES.FAILED_RENAME);
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteItem(id);

    if (result.success) {
      toast.success(SUCCESS_MESSAGES.ITEM_DELETED);
      return true;
    } else {
      toast.error(result.message || ERROR_MESSAGES.FAILED_DELETE);
      return false;
    }
  };

  const handleMove = async (id: string, newParentId: string | null, itemName: string) => {
    const result = await moveItem({ id, newParentId });

    if (result.success) {
      toast.success(SUCCESS_MESSAGES.ITEM_MOVED(itemName));
      return true;
    } else {
      toast.error(result.message || ERROR_MESSAGES.FAILED_MOVE);
      return false;
    }
  };

  const handleNavigate = async (folderId: string | null) => {
    await navigateToFolder(folderId);
  };

  const handleItemClick = async (item: DataRoomItem, onPreview: (item: DataRoomItem) => void) => {
    if (item.type === ItemType.FOLDER) {
      await handleNavigate(item.id);
    } else if (item.type === ItemType.FILE) {
      onPreview(item);
    }
  };

  const handleDownload = (file: DataRoomItem) => {
    if (file.type !== ItemType.FILE) return;

    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(SUCCESS_MESSAGES.FILE_DOWNLOADED(file.name));
  };

  return {
    handleCreateFolder,
    handleRename,
    handleDelete,
    handleMove,
    handleNavigate,
    handleItemClick,
    handleDownload,
  };
};
