import { UnauthenticatedError, UnauthorizedError } from './auth';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from './common';

export const getErrorFromStatus = (status: number, message: string): unknown => {
  let errorToThrow: unknown;
  switch (status) {
    case 422:
      errorToThrow = new UnprocessableEntityError(message);
      break;
    case 400:
      errorToThrow = new BadRequestError(message);
      break;
    case 401:
      if (message === 'Signature has expired') {
        errorToThrow = new UnauthenticatedError(
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        );
      } else {
        errorToThrow = new UnauthenticatedError(message);
      }
      break;
    case 403:
      errorToThrow = new UnauthorizedError(message);
      break;
    case 404:
      errorToThrow = new NotFoundError(message);
      break;
    case 500:
    case 502:
      errorToThrow = new InternalServerError(
        'Hubo un error inesperado, por favor intenta de nuevo más tarde'
      );
      break;
    default:
      errorToThrow = new Error(message);
  }

  return errorToThrow;
};

export const handleApiError = (error: unknown, status: number, responseOnly = false): unknown => {
  const responseData = error as Record<string, string>;
  const errorMessage = responseData?.error || responseData?.errors || responseData.message;
  const errorToThrow = getErrorFromStatus(status, errorMessage);
  if (responseOnly) return errorToThrow;
  throw errorToThrow;
};
