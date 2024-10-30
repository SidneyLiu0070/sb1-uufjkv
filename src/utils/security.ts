import { ApiError } from '../types/api';

export const RATE_LIMIT = {
  MAX_REQUESTS_PER_MINUTE: 60,
  COOLDOWN_PERIOD: 60 * 1000, // 1 minute in milliseconds
};

export const CONTENT_SECURITY = {
  MAX_CONTENT_LENGTH: 50000, // 50KB
  ALLOWED_MARKDOWN_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'ul', 'ol', 'li', 'blockquote',
    'strong', 'em', 'code', 'pre'
  ],
  SANITIZE_OPTIONS: {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3'],
    allowedAttributes: {
      'a': ['href', 'target', 'rel']
    }
  }
};

export function validateContent(content: string): void {
  if (!content) {
    throw new ApiError('Content cannot be empty', 400);
  }

  if (content.length > CONTENT_SECURITY.MAX_CONTENT_LENGTH) {
    throw new ApiError('Content exceeds maximum length', 400);
  }

  // Add additional content validation as needed
}