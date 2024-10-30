import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ApiError } from '../types/api';
import { useMoonshotStore } from '../store/moonshotStore';

export function useApiError() {
  const error = useMoonshotStore((state) => state.error);
  const setError = useMoonshotStore((state) => state.setError);

  useEffect(() => {
    if (error) {
      const message = error instanceof ApiError 
        ? error.message 
        : 'An unexpected error occurred';
        
      toast.error(message, {
        duration: 4000,
        position: 'top-right'
      });
      
      setError(null);
    }
  }, [error, setError]);

  return { error, setError };
}