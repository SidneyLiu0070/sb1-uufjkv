import { ApiError } from '../types/api';

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function handleApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }
  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }
  return new ApiError('An unexpected error occurred', 500);
}