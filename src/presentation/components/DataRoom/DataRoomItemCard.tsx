import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Folder, File, MoreVertical, Edit2, FolderInput, Download, Trash2 } from 'lucide-react';
import { DataRoomItem, ItemType } from '../../../domain/types';
import { formatFileSize, formatDate } from '../../../infrastructure/utils/fileUtils';
import { UI_TEXT } from '../../constants/messages';

interface DataRoomItemCardProps {
  item: DataRoomItem;
  isDragged: boolean;
  isDropTarget: boolean;
  draggedItem: DataRoomItem | null;
  onItemClick: (item: DataRoomItem) => void;
  onDragStart: (e: React.DragEvent, item: DataRoomItem) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, itemId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, itemId: string) => void;
  onRename: (item: DataRoomItem) => void;
  onMove: (item: DataRoomItem) => void;
  onDownload: (item: DataRoomItem) => void;
  onDelete: (item: DataRoomItem) => void;
}

export const DataRoomItemCard = ({
  item,
  isDragged,
  isDropTarget,
  draggedItem,
  onItemClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onRename,
  onMove,
  onDownload,
  onDelete,
}: DataRoomItemCardProps) => {
  const cardContent = (
    <div
      draggable={!draggedItem || draggedItem.id === item.id}
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => item.type === ItemType.FOLDER && onDragOver(e, item.id)}
      onDragLeave={(e) => item.type === ItemType.FOLDER && onDragLeave(e)}
      onDrop={(e) => item.type === ItemType.FOLDER && onDrop(e, item.id)}
      className={`p-4 border rounded-lg hover:bg-accent cursor-pointer transition-all ${
        isDragged ? 'opacity-50' : ''
      } ${isDropTarget ? 'border-primary border-2 bg-primary/5' : ''}`}
      onClick={() => onItemClick(item)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {item.type === ItemType.FOLDER ? (
            <Folder className="w-8 h-8 text-blue-500 flex-shrink-0" />
          ) : (
            <File className="w-8 h-8 text-red-500 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              {item.type === ItemType.FILE ? formatFileSize(item.size) : 'Folder'}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(item.updatedAt)}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRename(item);
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onMove(item);
              }}
            >
              <FolderInput className="w-4 h-4 mr-2" />
              Move to...
            </DropdownMenuItem>
            {item.type === ItemType.FILE && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(item);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return item.type === ItemType.FOLDER ? (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{UI_TEXT.TOOLTIPS.DRAG_TO_FOLDER}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    cardContent
  );
};
