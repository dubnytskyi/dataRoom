import { useState, useEffect } from 'react';
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

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newName: string) => Promise<boolean>;
  currentName?: string;
}

export const RenameDialog = ({ open, onOpenChange, onSubmit, currentName }: RenameDialogProps) => {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (open && currentName) {
      setNewName(currentName);
    }
  }, [open, currentName]);

  const handleSubmit = async () => {
    const success = await onSubmit(newName);
    if (success) {
      setNewName('');
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
          <DialogTitle>{UI_TEXT.DIALOGS.RENAME_TITLE}</DialogTitle>
          <DialogDescription>{UI_TEXT.DIALOGS.RENAME_DESC}</DialogDescription>
        </DialogHeader>
        <Input
          placeholder={UI_TEXT.PLACEHOLDERS.NEW_NAME}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {UI_TEXT.BUTTONS.CANCEL}
          </Button>
          <Button onClick={handleSubmit}>{UI_TEXT.BUTTONS.RENAME}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
