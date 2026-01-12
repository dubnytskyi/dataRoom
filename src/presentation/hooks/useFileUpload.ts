import { toast } from 'sonner';
import { UploadFileDTO } from '../../domain/types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/messages';
import { MIME_TYPES } from '../../domain/constants/file';
import { readFileAsDataURL } from '../../infrastructure/utils/fileUtils';

interface UseFileUploadProps {
  currentFolderId: string | null;
  uploadFile: (dto: UploadFileDTO) => Promise<{ success: boolean; message?: string }>;
}

export const useFileUpload = ({ currentFolderId, uploadFile }: UseFileUploadProps) => {
  const validatePdfFile = (file: File): boolean => {
    if (file.type !== MIME_TYPES.PDF) {
      toast.error(ERROR_MESSAGES.ONLY_PDF_ALLOWED);
      return false;
    }
    return true;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validatePdfFile(file)) return;

    try {
      const data = await readFileAsDataURL(file);

      const result = await uploadFile({
        name: file.name,
        parentId: currentFolderId,
        size: file.size,
        mimeType: file.type,
        data,
      });

      if (result.success) {
        toast.success(SUCCESS_MESSAGES.FILE_UPLOADED);
      } else {
        toast.error(result.message || ERROR_MESSAGES.FAILED_UPLOAD);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_UPLOAD);
    }
  };

  const handleFileDrop = async (files: FileList) => {
    const validFiles = Array.from(files).filter(validatePdfFile);

    if (validFiles.length === 0) return;

    try {
      for (const file of validFiles) {
        const data = await readFileAsDataURL(file);

        const result = await uploadFile({
          name: file.name,
          parentId: currentFolderId,
          size: file.size,
          mimeType: file.type,
          data,
        });

        if (result.success) {
          toast.success(SUCCESS_MESSAGES.FILE_UPLOADED);
        } else {
          toast.error(result.message || ERROR_MESSAGES.FAILED_UPLOAD);
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_UPLOAD);
    }
  };

  return {
    handleFileUpload,
    handleFileDrop,
  };
};
