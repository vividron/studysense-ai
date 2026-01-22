export class AppError extends Error {
  constructor(message, type, statusCode = 500, originalError) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}
