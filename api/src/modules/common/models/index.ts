export interface AppError extends Error {
  statusCode?: number;
  cause?: unknown;
}
