import React, { useEffect } from 'react';
import { useContentProcessing } from '../hooks/useContentProcessing';

interface ContentDisplayProps {
  content: string;
  onProcessed: (processedContent: { text: string; json?: Record<string, any> }) => void;
  onError: (error: string) => void;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
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
    const handleContentProcessing = async () => {
      try {
        const processed = await processContent(content);
        onProcessed(processed);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Content processing failed');
      }
    };

    if (content) {
      handleContentProcessing();
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
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p className="font-medium">Error processing content:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!processedContent) {
    return null;
  }

  return (
    <div className="w-full">
      {processedContent.json ? (
        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
          <code className="text-sm">
            {JSON.stringify(processedContent.json, null, 2)}
          </code>
        </pre>
      ) : (
        <div className="prose max-w-none">
          {processedContent.text}
        </div>
      )}
    </div>
  );
};