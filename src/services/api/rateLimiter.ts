export class RateLimiter {
  private lastRequestTime: number = 0;
  private readonly delayMs: number;

  constructor(requestsPerMinute: number) {
    this.delayMs = (60 / requestsPerMinute) * 1000;
  }

  async enforce(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.delayMs) {
      await new Promise(resolve => 
        setTimeout(resolve, this.delayMs - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }
}

export const rateLimiter = new RateLimiter(API_CONFIG.RATE_LIMIT_PER_MINUTE);