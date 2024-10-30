import { create } from 'zustand';
import { moonshotApi } from '../services/moonshotApi';
import { ApiError, MoonshotConfig } from '../types/api';

interface MoonshotState {
  config: MoonshotConfig;
  error: ApiError | null;
  isLoading: boolean;
  setConfig: (config: Partial<MoonshotConfig>) => void;
  setError: (error: ApiError | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useMoonshotStore = create<MoonshotState>((set) => ({
  config: moonshotApi.getConfig(),
  error: null,
  isLoading: false,
  setConfig: (newConfig) => {
    try {
      moonshotApi.setConfig(newConfig);
      set((state) => ({
        config: {
          ...state.config,
          ...newConfig
        },
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof ApiError ? error : new ApiError('Failed to update config') });
    }
  },
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading })
}));