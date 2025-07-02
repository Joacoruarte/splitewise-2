import { CustomError } from './common';

export class AuthenticationError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class UnauthenticatedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}
