import { ApiError } from '../types/api';
import { RateLimiter } from './rateLimiter';

export class ApiClient {
  private readonly baseUrl: string;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly rateLimiter: RateLimiter;

  constructor(
    baseUrl: string, 
    maxRetries = 3, 
    retryDelay = 1000,
    requestsPerSecond = 2
  ) {
    this.baseUrl = baseUrl;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
    this.rateLimiter = new RateLimiter(requestsPerSecond);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorCode: string | undefined;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
        errorCode = errorData.error?.code;
      } catch {
        // Use default error message if JSON parsing fails
      }

      throw new ApiError(errorMessage, response.status, errorCode);
    }

    try {
      return await response.json() as T;
    } catch (error) {
      throw new ApiError('Invalid JSON response from server', 500);
    }
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (
        attempt < this.maxRetries && 
        error instanceof ApiError && 
        (error.status === 429 || error.status >= 500 || error.status === 408)
      ) {
        const delayTime = this.retryDelay * Math.pow(2, attempt - 1);
        await this.delay(delayTime);
        return this.retryWithBackoff(operation, attempt + 1);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, headers: HeadersInit): Promise<T> {
    return this.rateLimiter.schedule(() => 
      this.retryWithBackoff(async () => {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });
        return this.handleResponse<T>(response);
      })
    );
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    headers: HeadersInit
  ): Promise<T> {
    return this.rateLimiter.schedule(() => 
      this.retryWithBackoff(async () => {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
          credentials: 'include'
        });
        return this.handleResponse<T>(response);
      })
    );
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    headers: HeadersInit
  ): Promise<T> {
    // Remove Content-Type header for FormData
    const formHeaders = { ...headers };
    delete formHeaders['Content-Type'];

    return this.rateLimiter.schedule(() => 
      this.retryWithBackoff(async () => {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: formHeaders,
          body: formData,
          credentials: 'include'
        });
        return this.handleResponse<T>(response);
      })
    );
  }
}