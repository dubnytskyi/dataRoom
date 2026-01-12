import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { DataRoomItem, MoveItemDTO } from '../../domain/types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/messages';

interface UseDragAndDropProps {
  moveItem: (dto: MoveItemDTO) => Promise<{ success: boolean; message?: string }>;
  onFileDrop: (files: FileList) => Promise<void>;
}

export const useDragAndDrop = ({ moveItem, onFileDrop }: UseDragAndDropProps) => {
  const [draggedItem, setDraggedItem] = useState<DataRoomItem | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [breadcrumbDropTarget, setBreadcrumbDropTarget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  // Internal drag & drop (moving items between folders)
  const handleItemDragStart = (e: React.DragEvent, item: DataRoomItem) => {
    e.stopPropagation();
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleItemDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedItem(null);
    setDropTargetId(null);
  };

  const handleFolderDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem && draggedItem.id !== folderId) {
      e.dataTransfer.dropEffect = 'move';
      setDropTargetId(folderId);
    }
  };

  const handleFolderDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetId(null);
  };

  const handleFolderDrop = async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetId(null);

    if (!draggedItem) return;

    if (draggedItem.id === targetFolderId) {
      toast.error(ERROR_MESSAGES.DRAG_DROP_MOVE_INTO_ITSELF);
      return;
    }

    const result = await moveItem({
      id: draggedItem.id,
      newParentId: targetFolderId,
    });

    if (result.success) {
      toast.success(SUCCESS_MESSAGES.ITEM_MOVED(draggedItem.name));
    } else {
      toast.error(result.message || ERROR_MESSAGES.FAILED_MOVE);
    }

    setDraggedItem(null);
  };

  const handleBreadcrumbDragOver = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem && draggedItem.id !== folderId) {
      e.dataTransfer.dropEffect = 'move';
      setBreadcrumbDropTarget(folderId === null ? 'root' : folderId);
    }
  };

  const handleBreadcrumbDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBreadcrumbDropTarget(null);
  };

  const handleBreadcrumbDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setBreadcrumbDropTarget(null);
    setDropTargetId(null);

    if (!draggedItem) return;

    if (draggedItem.id === targetFolderId) {
      toast.error(ERROR_MESSAGES.DRAG_DROP_MOVE_INTO_ITSELF);
      return;
    }

    const result = await moveItem({
      id: draggedItem.id,
      newParentId: targetFolderId,
    });

    if (result.success) {
      toast.success(SUCCESS_MESSAGES.ITEM_MOVED(draggedItem.name));
    } else {
      toast.error(result.message || ERROR_MESSAGES.FAILED_MOVE);
    }

    setDraggedItem(null);
  };

  // External drag & drop (files from OS)
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem) return;

    dragCounter.current++;
    if (dragCounter.current > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem) return;

    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem) return;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem) return;

    dragCounter.current = 0;
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await onFileDrop(files);
    }
  };

  return {
    // State
    draggedItem,
    dropTargetId,
    breadcrumbDropTarget,
    isDragging,
    // Internal drag & drop handlers
    handleItemDragStart,
    handleItemDragEnd,
    handleFolderDragOver,
    handleFolderDragLeave,
    handleFolderDrop,
    handleBreadcrumbDragOver,
    handleBreadcrumbDragLeave,
    handleBreadcrumbDrop,
    // External drag & drop handlers
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
};
