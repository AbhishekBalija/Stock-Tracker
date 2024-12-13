export class StockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StockError';
  }

  static isStockError(error: unknown): error is StockError {
    return error instanceof StockError;
  }

  static getErrorMessage(error: unknown): string {
    if (StockError.isStockError(error)) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }
}