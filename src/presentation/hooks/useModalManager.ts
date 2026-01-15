import { useState } from 'react';
import { DataRoomItem } from '../../domain/types';

export enum ModalType {
  CREATE_FOLDER = 'CREATE_FOLDER',
  RENAME = 'RENAME',
  DELETE = 'DELETE',
  MOVE_TO = 'MOVE_TO',
  PDF_PREVIEW = 'PDF_PREVIEW',
}

interface ModalState {
  [ModalType.CREATE_FOLDER]: boolean;
  [ModalType.RENAME]: boolean;
  [ModalType.DELETE]: boolean;
  [ModalType.MOVE_TO]: boolean;
  [ModalType.PDF_PREVIEW]: boolean;
}

export const useModalManager = () => {
  const [modals, setModals] = useState<ModalState>({
    [ModalType.CREATE_FOLDER]: false,
    [ModalType.RENAME]: false,
    [ModalType.DELETE]: false,
    [ModalType.MOVE_TO]: false,
    [ModalType.PDF_PREVIEW]: false,
  });

  const [selectedItem, setSelectedItem] = useState<DataRoomItem | null>(null);
  const [previewFile, setPreviewFile] = useState<DataRoomItem | null>(null);

  const openModal = (type: ModalType, item?: DataRoomItem) => {
    setModals((prev) => ({ ...prev, [type]: true }));
    if (item) {
      setSelectedItem(item);
      if (type === ModalType.PDF_PREVIEW) {
        setPreviewFile(item);
      }
    }
  };

  const closeModal = (type: ModalType) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    if (type !== ModalType.PDF_PREVIEW) {
      // Don't clear selectedItem immediately for preview as it might be used elsewhere
      setSelectedItem(null);
    }
    if (type === ModalType.PDF_PREVIEW) {
      setPreviewFile(null);
    }
  };

  return {
    modals,
    selectedItem,
    previewFile,
    openModal,
    closeModal,
  };
};
