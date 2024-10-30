import { ApiError, handleApiError } from '../utils/errorHandling';
import { moonshotApi } from './moonshotApi';

export class ContentProcessor {
  private static instance: ContentProcessor;

  private constructor() {}

  static getInstance(): ContentProcessor {
    if (!this.instance) {
      this.instance = new ContentProcessor();
    }
    return this.instance;
  }

  async processContent(content: string): Promise<string> {
    try {
      const response = await moonshotApi.processContent(content);
      
      if (response.error) {
        throw new ApiError(
          response.error.message,
          response.error.status,
          response.error.code
        );
      }

      if (!response.data) {
        throw new ApiError('No content received from API');
      }

      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('Content processing error:', apiError);
      throw apiError;
    }
  }

  async validateAndProcessJson(content: string): Promise<Record<string, unknown>> {
    try {
      const processedContent = await this.processContent(content);
      const jsonContent = JSON.parse(processedContent);
      return jsonContent;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('JSON processing error:', apiError);
      throw apiError;
    }
  }
}

export const contentProcessor = ContentProcessor.getInstance();