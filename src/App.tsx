import { useState, useEffect } from 'react';
import { useDataRoom } from './presentation/hooks/useDataRoom';
import { useFileUpload } from './presentation/hooks/useFileUpload';
import { useDragAndDrop } from './presentation/hooks/useDragAndDrop';
import { useModalManager, ModalType } from './presentation/hooks/useModalManager';
import { useItemOperations } from './presentation/hooks/useItemOperations';
import { useBreadcrumbs } from './presentation/hooks/useBreadcrumbs';
import { useSearch } from './presentation/hooks/useSearch';
import { useItemFiltering } from './presentation/hooks/useItemFiltering';
import { useAuth } from './presentation/context/AuthContext';
import { MoveToModal } from './presentation/components/MoveToModal';
import { CreateFolderDialog } from './presentation/components/dialogs/CreateFolderDialog';
import { RenameDialog } from './presentation/components/dialogs/RenameDialog';
import { DeleteConfirmationDialog } from './presentation/components/dialogs/DeleteConfirmationDialog';
import { PdfPreviewDialog } from './presentation/components/dialogs/PdfPreviewDialog';
import { LoadingState } from './presentation/components/states/LoadingState';
import { ErrorState } from './presentation/components/states/ErrorState';
import { EmptyFolderState } from './presentation/components/DataRoom/EmptyFolderState';
import { DragDropOverlay } from './presentation/components/DataRoom/DragDropOverlay';
import { DataRoomHeader } from './presentation/components/DataRoom/DataRoomHeader';
import { DataRoomItemCard } from './presentation/components/DataRoom/DataRoomItemCard';
import { AuthPage } from './presentation/components/auth/AuthPage';
import { DataRoomItem } from './domain/types';
import { Toaster } from 'sonner';

function App() {
  const { user, loading: authLoading } = useAuth();
  const {
    items,
    currentFolderId,
    loading,
    error,
    sortConfig,
    setSortConfig,
    createFolder,
    uploadFile,
    renameItem,
    deleteItem,
    moveItem,
    navigateToFolder,
    getBreadcrumbs,
    getAllFolders,
    getAllItems,
  } = useDataRoom();


  const [allFolders, setAllFolders] = useState<DataRoomItem[]>([]);
  const [allItems, setAllItems] = useState<DataRoomItem[]>([]);

  // Modal management
  const { modals, selectedItem, previewFile, openModal, closeModal } = useModalManager();

  // Breadcrumbs
  const { breadcrumbs } = useBreadcrumbs({ currentFolderId, getBreadcrumbs });

  // Search and filter
  const { searchQuery, setSearchQuery, filterType, setFilterType, filteredItems } = useSearch(allItems);

  // Calculate items to display based on search and filter
  const { itemsToDisplay } = useItemFiltering({
    items,
    searchQuery,
    filterType,
    filteredItems,
  });

  // File upload
  const { handleFileUpload, handleFileDrop } = useFileUpload({
    currentFolderId,
    uploadFile,
  });

  // Drag and drop
  const {
    draggedItem,
    dropTargetId,
    breadcrumbDropTarget,
    isDragging,
    handleItemDragStart,
    handleItemDragEnd,
    handleFolderDragOver,
    handleFolderDragLeave,
    handleFolderDrop,
    handleBreadcrumbDragOver,
    handleBreadcrumbDragLeave,
    handleBreadcrumbDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useDragAndDrop({
    moveItem,
    onFileDrop: handleFileDrop,
  });

  // Item operations
  const {
    handleCreateFolder: performCreateFolder,
    handleRename: performRename,
    handleDelete: performDelete,
    handleMove,
    handleNavigate,
    handleItemClick: performItemClick,
    handleDownload,
  } = useItemOperations({
    createFolder,
    renameItem,
    deleteItem,
    moveItem,
    navigateToFolder,
  });

  // Load all items for search whenever items change
  useEffect(() => {
    const loadAllItems = async () => {
      const all = await getAllItems();
      setAllItems(all);
    };
    loadAllItems();
  }, [items, getAllItems]);

  // Wrapper functions for operations
  const handleCreateFolderSubmit = async (name: string) => {
    const success = await performCreateFolder(name, currentFolderId);
    return success;
  };

  const handleRenameSubmit = async (newName: string) => {
    if (!selectedItem) return false;
    const success = await performRename(selectedItem.id, newName);
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return false;
    const success = await performDelete(selectedItem.id);
    return success;
  };

  const handleItemClick = (item: DataRoomItem) => {
    performItemClick(item, (file) => openModal(ModalType.PDF_PREVIEW, file));
  };

  const handleMoveToClick = async (item: DataRoomItem) => {
    const folders = await getAllFolders();
    setAllFolders(folders);
    openModal(ModalType.MOVE_TO, item);
  };

  const handleMoveToFolder = async (targetFolderId: string | null) => {
    if (!selectedItem) return;
    const success = await handleMove(selectedItem.id, targetFolderId, selectedItem.name);
    if (success) {
      closeModal(ModalType.MOVE_TO);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <LoadingState />
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <AuthPage />
      </>
    );
  }

  // Show loading for data
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <LoadingState />
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <ErrorState error={error} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-8 relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Toaster position="top-right" />

      <DragDropOverlay visible={isDragging} />

      <div className="max-w-7xl mx-auto">
        <DataRoomHeader
          breadcrumbs={breadcrumbs}
          onNavigate={handleNavigate}
          onCreateFolder={() => openModal(ModalType.CREATE_FOLDER)}
          onFileUpload={handleFileUpload}
          breadcrumbDropTarget={breadcrumbDropTarget}
          onBreadcrumbDragOver={handleBreadcrumbDragOver}
          onBreadcrumbDragLeave={handleBreadcrumbDragLeave}
          onBreadcrumbDrop={handleBreadcrumbDrop}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
        />

        {/* Items Grid */}
        {itemsToDisplay.length === 0 && <EmptyFolderState />}

        {itemsToDisplay.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {itemsToDisplay.map((item) => (
              <DataRoomItemCard
                key={item.id}
                item={item}
                isDragged={draggedItem?.id === item.id}
                isDropTarget={dropTargetId === item.id}
                draggedItem={draggedItem}
                onItemClick={handleItemClick}
                onDragStart={handleItemDragStart}
                onDragEnd={handleItemDragEnd}
                onDragOver={handleFolderDragOver}
                onDragLeave={handleFolderDragLeave}
                onDrop={handleFolderDrop}
                onRename={(item) => openModal(ModalType.RENAME, item)}
                onMove={handleMoveToClick}
                onDownload={handleDownload}
                onDelete={(item) => openModal(ModalType.DELETE, item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateFolderDialog
        open={modals[ModalType.CREATE_FOLDER]}
        onOpenChange={(open) => !open && closeModal(ModalType.CREATE_FOLDER)}
        onSubmit={handleCreateFolderSubmit}
      />

      <RenameDialog
        open={modals[ModalType.RENAME]}
        onOpenChange={(open) => !open && closeModal(ModalType.RENAME)}
        onSubmit={handleRenameSubmit}
        currentName={selectedItem?.name}
      />

      <DeleteConfirmationDialog
        open={modals[ModalType.DELETE]}
        onOpenChange={(open) => !open && closeModal(ModalType.DELETE)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedItem?.name}
        itemType={selectedItem?.type}
      />

      <MoveToModal
        open={modals[ModalType.MOVE_TO]}
        onOpenChange={(open) => !open && closeModal(ModalType.MOVE_TO)}
        onMove={handleMoveToFolder}
        folders={allFolders}
        currentItemId={selectedItem?.id || ''}
        currentParentId={selectedItem?.parentId}
      />

      <PdfPreviewDialog
        open={modals[ModalType.PDF_PREVIEW]}
        onOpenChange={(open) => !open && closeModal(ModalType.PDF_PREVIEW)}
        file={previewFile}
        onDownload={handleDownload}
      />
    </div>
  );
}

export default App;
