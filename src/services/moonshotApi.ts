import { ApiClient } from './apiClient';
import { DEFAULT_CONFIG } from './config';
import {
  ApiError,
  ChatMessage,
  ChatResponse,
  FileUploadResponse,
  MoonshotConfig
} from '../types/api';

class MoonshotApiService {
  private readonly apiClient: ApiClient;
  private config: MoonshotConfig;

  constructor() {
    this.apiClient = new ApiClient(
      'https://api.moonshot.cn/v1',
      3,
      1000,
      2
    );
    this.config = { ...DEFAULT_CONFIG };
  }

  getConfig(): Readonly<MoonshotConfig> {
    return Object.freeze({ ...this.config });
  }

  setConfig(newConfig: Partial<MoonshotConfig>): void {
    if (!newConfig) {
      throw new ApiError('Invalid configuration', 400);
    }

    this.config = {
      ...this.config,
      ...newConfig
    };

    // Validate the updated config
    if (this.config.apiKey && !this.isValidApiKey(this.config.apiKey)) {
      throw new ApiError('Invalid API key format', 400);
    }
  }

  private isValidApiKey(apiKey: string): boolean {
    return /^sk-[A-Za-z0-9]{48}$/.test(apiKey.trim());
  }

  private getHeaders(isFormData = false): HeadersInit {
    const apiKey = this.config.apiKey?.trim();
    if (!apiKey) {
      throw new ApiError('API key is required', 401);
    }
    
    if (!this.isValidApiKey(apiKey)) {
      throw new ApiError('Invalid API key format', 401);
    }

    const headers: HeadersInit = {
      'Authorization': `Bearer ${apiKey}`
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  async processContent(content: string): Promise<string> {
    if (!content?.trim()) {
      throw new ApiError('Content cannot be empty', 400);
    }

    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.config.systemPrompt
        },
        {
          role: 'user',
          content
        }
      ];

      const response = await this.apiClient.post<ChatResponse>(
        '/chat/completions',
        {
          model: this.config.model,
          messages,
          temperature: 0.3,
          max_tokens: 2000
        },
        this.getHeaders()
      );

      if (!response?.choices?.[0]?.message?.content) {
        throw new ApiError('Invalid API response format', 500);
      }

      return response.choices[0].message.content;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to process content',
        500
      );
    }
  }

  async uploadFile(file: File): Promise<FileUploadResponse> {
    if (!file) {
      throw new ApiError('File is required', 400);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'file-extract');

      return await this.apiClient.postFormData<FileUploadResponse>(
        '/files',
        formData,
        this.getHeaders(true)
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to upload file',
        500
      );
    }
  }

  async getFileContent(fileId: string): Promise<{ content: string }> {
    if (!fileId?.trim()) {
      throw new ApiError('File ID is required', 400);
    }

    try {
      return await this.apiClient.get<{ content: string }>(
        `/files/${fileId}/content`,
        this.getHeaders()
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to get file content',
        500
      );
    }
  }
}

export const moonshotApi = new MoonshotApiService();