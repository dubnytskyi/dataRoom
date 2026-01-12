import { FolderOpen } from 'lucide-react';

export const EmptyFolderState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
      <FolderOpen className="w-16 h-16 mb-4" />
      <p>This folder is empty</p>
    </div>
  );
};
