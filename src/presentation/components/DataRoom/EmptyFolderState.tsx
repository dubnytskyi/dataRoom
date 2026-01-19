import { FolderOpen, Upload, FolderPlus, Move } from 'lucide-react';
import { UI_TEXT } from '../../constants/messages';

export const EmptyFolderState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <FolderOpen className="w-16 h-16 mb-6 opacity-50" />
      <h3 className="text-xl font-semibold mb-8 text-foreground">{UI_TEXT.EMPTY_STATE.TITLE}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">{UI_TEXT.EMPTY_STATE.UPLOAD_TITLE}</h4>
          <p className="text-sm">{UI_TEXT.EMPTY_STATE.UPLOAD_DESC}</p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <FolderPlus className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">{UI_TEXT.EMPTY_STATE.ORGANIZE_TITLE}</h4>
          <p className="text-sm">{UI_TEXT.EMPTY_STATE.ORGANIZE_DESC}</p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Move className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">{UI_TEXT.EMPTY_STATE.MOVE_TITLE}</h4>
          <p className="text-sm">{UI_TEXT.EMPTY_STATE.MOVE_DESC}</p>
        </div>
      </div>
    </div>
  );
};
