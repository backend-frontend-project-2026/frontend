import type { ErrorResponse } from '@/shared/api/generated';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isApiErrorResponse(error: unknown): error is ErrorResponse {
  return (
    isRecord(error) &&
    typeof error.error === 'string' &&
    typeof error.message === 'string' &&
    typeof error.status_code === 'number'
  );
}

export function getApiErrorMessage(error: unknown): string {
  if (isApiErrorResponse(error)) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return 'Что-то пошло не так. Попробуй ещё раз.';
}
