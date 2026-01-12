import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ItemType } from '../../../domain/types';
import { UI_TEXT } from '../../constants/messages';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  itemName?: string;
  itemType?: ItemType;
}

export const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  itemType,
}: DeleteConfirmationDialogProps) => {
  const handleConfirm = async () => {
    const success = await onConfirm();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{UI_TEXT.DIALOGS.DELETE_TITLE}</DialogTitle>
          <DialogDescription>
            {UI_TEXT.DIALOGS.DELETE_CONFIRM(itemName || '')}
            {itemType === ItemType.FOLDER && UI_TEXT.DIALOGS.DELETE_FOLDER_WARNING}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {UI_TEXT.BUTTONS.CANCEL}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {UI_TEXT.BUTTONS.DELETE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
