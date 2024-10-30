export class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private lastRequestTime = 0;
  private readonly minDelay: number;
  private readonly maxRetries: number;
  private readonly baseDelay: number;

  constructor(
    requestsPerSecond = 2,
    maxRetries = 3,
    baseDelay = 1000
  ) {
    this.minDelay = 1000 / requestsPerSecond;
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  async schedule<T>(task: () => Promise<T>, retryCount = 0): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await this.executeWithRetry(task, retryCount);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async executeWithRetry<T>(
    task: () => Promise<T>,
    retryCount: number
  ): Promise<T> {
    try {
      const result = await this.executeWithDelay(task);
      return result;
    } catch (error) {
      if (
        error instanceof Error &&
        'status' in error &&
        error.status === 429 &&
        retryCount < this.maxRetries
      ) {
        const delay = this.calculateBackoff(retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(task, retryCount + 1);
      }
      throw error;
    }
  }

  private calculateBackoff(retryCount: number): number {
    return Math.min(
      this.baseDelay * Math.pow(2, retryCount),
      10000 // Max 10 seconds
    );
  }

  private async executeWithDelay<T>(task: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const delay = Math.max(0, this.minDelay - timeSinceLastRequest);

    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
    return task();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
      }
    }

    this.processing = false;
  }
}