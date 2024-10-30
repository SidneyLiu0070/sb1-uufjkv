import React, { useEffect } from 'react';
import { useContentProcessing } from '../hooks/useContentProcessing';

interface ContentProcessorProps {
  content: string;
  onProcessed: (content: string) => void;
  onError: (error: string) => void;
}

export const ContentProcessor: React.FC<ContentProcessorProps> = ({
  content,
  onProcessed,
  onError
}) => {
  const {
    isProcessing,
    error,
    processedContent,
    processContent
  } = useContentProcessing();

  useEffect(() => {
    const process = async () => {
      try {
        const result = await processContent(content);
        onProcessed(result);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Processing failed');
      }
    };

    if (content) {
      process();
    }
  }, [content, processContent, onProcessed, onError]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-md bg-red-50">
        {error}
      </div>
    );
  }

  return null;
};