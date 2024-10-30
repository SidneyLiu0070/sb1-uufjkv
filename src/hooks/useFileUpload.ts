import { useState, useCallback } from 'react';
import { FileService } from '../services/fileService';
import { moonshotApi } from '../services/moonshotApi';
import { ApiError } from '../types/api';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      FileService.validateFile(file);
      const response = await moonshotApi.uploadFile(file);
      const content = await moonshotApi.getFileContent(response.id);
      return content.content;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to upload file';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    isUploading,
    error,
    uploadFile,
    setError
  };
}