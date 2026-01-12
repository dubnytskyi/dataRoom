import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { UI_TEXT } from '../../constants/messages';
import { KEYBOARD_KEYS } from '../../constants/keyboard';

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<boolean>;
}

export const CreateFolderDialog = ({ open, onOpenChange, onSubmit }: CreateFolderDialogProps) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = async () => {
    const success = await onSubmit(folderName);
    if (success) {
      setFolderName('');
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEYBOARD_KEYS.ENTER) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{UI_TEXT.DIALOGS.CREATE_FOLDER_TITLE}</DialogTitle>
          <DialogDescription>{UI_TEXT.DIALOGS.CREATE_FOLDER_DESC}</DialogDescription>
        </DialogHeader>
        <Input
          placeholder={UI_TEXT.PLACEHOLDERS.FOLDER_NAME}
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {UI_TEXT.BUTTONS.CANCEL}
          </Button>
          <Button onClick={handleSubmit}>{UI_TEXT.BUTTONS.CREATE}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
