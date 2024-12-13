let lastRequestTime = 0;

export class RateLimiter {
  private delayMs: number;

  constructor(requestsPerMinute: number) {
    this.delayMs = (60 / requestsPerMinute) * 1000;
  }

  async enforce(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < this.delayMs) {
      await new Promise(resolve => 
        setTimeout(resolve, this.delayMs - timeSinceLastRequest)
      );
    }
    
    lastRequestTime = Date.now();
  }
}