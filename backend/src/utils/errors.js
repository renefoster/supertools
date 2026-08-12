export class AppError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', status = 500) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
  }
}
