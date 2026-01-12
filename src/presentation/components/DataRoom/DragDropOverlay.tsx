import { Upload } from 'lucide-react';

interface DragDropOverlayProps {
  visible: boolean;
}

export const DragDropOverlay = ({ visible }: DragDropOverlayProps) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-primary/10 border-4 border-dashed border-primary rounded-lg flex items-center justify-center z-50 pointer-events-none">
      <div className="text-center">
        <Upload className="w-16 h-16 mx-auto text-primary mb-4" />
        <p className="text-xl font-semibold text-primary">Drop PDF files here</p>
      </div>
    </div>
  );
};
