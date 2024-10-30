import { moonshotApi } from '../services/moonshotApi';
import { ApiError } from '../types/api';
import { validateContent } from './security';

export async function processContent(content: string): Promise<string> {
  try {
    // Validate content before processing
    validateContent(content);

    // Get and validate config
    const config = moonshotApi.getConfig();
    if (!config.systemPrompt?.trim()) {
      throw new ApiError('System prompt is not configured', 400);
    }
    if (!config.apiKey?.trim()) {
      throw new ApiError('API key is not configured', 400);
    }

    // Process content
    const processedContent = await moonshotApi.processContent(content);
    
    // Validate response format
    if (!processedContent?.trim()) {
      throw new ApiError('Empty response from API', 500);
    }

    if (!processedContent.includes('## 工艺流程及污染物')) {
      throw new ApiError('Invalid response format from API', 500);
    }

    return processedContent;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 429) {
        throw new ApiError('请求过于频繁，请稍后再试', 429);
      }
      throw error;
    }
    throw new ApiError(
      '内容处理失败，请重试',
      500,
      error instanceof Error ? error.message : undefined
    );
  }
}