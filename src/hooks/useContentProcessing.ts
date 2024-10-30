import { useState, useCallback } from 'react';
import { contentProcessor } from '../services/contentProcessor';
import { ApiError } from '../utils/errorHandling';

interface ContentProcessingState {
  isProcessing: boolean;
  error: string | null;
  processedContent: string | null;
}

export const useContentProcessing = () => {
  const [state, setState] = useState<ContentProcessingState>({
    isProcessing: false,
    error: null,
    processedContent: null
  });

  const processContent = useCallback(async (content: string) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      const processed = await contentProcessor.processContent(content);
      setState({
        isProcessing: false,
        error: null,
        processedContent: processed
      });
      return processed;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to process content';
      
      setState({
        isProcessing: false,
        error: errorMessage,
        processedContent: null
      });
      throw error;
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      error: null,
      processedContent: null
    });
  }, []);

  return {
    ...state,
    processContent,
    resetState
  };
};