import { useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Upload, ChevronRight, LogOut, User, Search, Filter, X } from 'lucide-react';
import { BreadcrumbItem } from '../../../domain/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../ui/dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { FilterType } from '../../hooks/useSearch';
import { UI_TEXT } from '../../constants/messages';

interface DataRoomHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  breadcrumbDropTarget: string | null;
  onBreadcrumbDragOver: (e: React.DragEvent, folderId: string | null) => void;
  onBreadcrumbDragLeave: (e: React.DragEvent) => void;
  onBreadcrumbDrop: (e: React.DragEvent, folderId: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const DataRoomHeader = ({
  breadcrumbs,
  onNavigate,
  onCreateFolder,
  onFileUpload,
  breadcrumbDropTarget,
  onBreadcrumbDragOver,
  onBreadcrumbDragLeave,
  onBreadcrumbDrop,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
}: DataRoomHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">DataRoom</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              {UI_TEXT.BUTTONS.LOGOUT}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {breadcrumbs.map((crumb, index) => {
          const isDropTarget = breadcrumbDropTarget === (crumb.id === null ? 'root' : crumb.id);

          return (
            <div key={crumb.id || 'root'} className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(crumb.id)}
                onDragOver={(e) => onBreadcrumbDragOver(e, crumb.id)}
                onDragLeave={onBreadcrumbDragLeave}
                onDrop={(e) => onBreadcrumbDrop(e, crumb.id)}
                className={`text-lg transition-all px-3 py-1.5 rounded-md ${
                  isDropTarget
                    ? 'bg-primary text-primary-foreground font-semibold scale-110 shadow-md'
                    : 'hover:text-primary hover:bg-accent'
                }`}
              >
                {crumb.name}
              </button>
              {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          );
        })}
      </div>

      {/* Action Buttons and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center">
        <div className="flex gap-2">
          <Button onClick={onCreateFolder} className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4">
            <Plus className="w-4 h-4 mr-2" />
            {UI_TEXT.BUTTONS.NEW_FOLDER}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4">
            <Upload className="w-4 h-4 mr-2" />
            {UI_TEXT.BUTTONS.UPLOAD_PDF}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={onFileUpload}
          className="hidden"
        />

        <div className="flex gap-2 w-full sm:flex-1 sm:max-w-md">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={UI_TEXT.PLACEHOLDERS.SEARCH}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={searchQuery ? "pl-10 pr-10" : "pl-10"}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={UI_TEXT.ARIA_LABELS.CLEAR_SEARCH}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label={UI_TEXT.FILTER.LABEL}>
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={filterType} onValueChange={(value) => onFilterChange(value as FilterType)}>
                <DropdownMenuRadioItem value={FilterType.ALL}>{UI_TEXT.FILTER.ALL}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={FilterType.FOLDERS}>{UI_TEXT.FILTER.FOLDERS_ONLY}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={FilterType.FILES}>{UI_TEXT.FILTER.FILES_ONLY}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
