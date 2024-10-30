export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProcessedContent {
  text: string;
  json?: Record<string, any>;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  processedContent: ProcessedContent | null;
}