import { create } from 'zustand';
import { ChatState, ChatMessage, ProcessedContent } from '../types/chat';
import { moonshotApi } from '../services/moonshotApi';

interface ChatStore extends ChatState {
  addMessage: (message: ChatMessage) => Promise<void>;
  setProcessedContent: (content: ProcessedContent) => void;
  clearMessages: () => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  processedContent: null,

  addMessage: async (message: ChatMessage) => {
    try {
      set({ isLoading: true, error: null });
      const messages = [...get().messages, message];
      set({ messages });

      const response = await moonshotApi.chat(messages);
      const assistantMessage = {
        role: 'assistant' as const,
        content: response.choices[0].message.content
      };

      set({ 
        messages: [...messages, assistantMessage],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to process message',
        isLoading: false 
      });
    }
  },

  setProcessedContent: (content: ProcessedContent) => {
    set({ processedContent: content });
  },

  clearMessages: () => {
    set({ messages: [], processedContent: null, error: null });
  },

  setError: (error: string | null) => {
    set({ error });
  }
}));