interface IResult<T, E> {
  ok(): this is Ok<T, E>
}

class Ok<T, E = never> implements IResult<T, never> {
  constructor(readonly value: T) {
  }

  ok(): this is Ok<T> {
    return true;
  }
}

export interface IError<E> {
  readonly errorType: E;
  readonly errorValue: unknown;
}

class Error<T, E> implements IResult<never, E>, IError<E> {
  constructor(readonly errorType: E, readonly errorValue: unknown) {
  }

  ok(): this is Ok<never, E> {
    return false;
  }
}

export type Result<T, E> = Ok<T, E> | Error<T, E>

function ok<T, E = never>(value: T): Ok<T, E> {
  return new Ok(value);
}

function error<E>(errorType: E,  errorValue: unknown): Error<never, E> {
  return new Error(errorType, errorValue);
}

export class Return {
  static ok<T>(value: T): Result<T, never> {
    return ok(value);
  }

  static error<E>(errorType: E, errorValue?: unknown): Result<never, E> {
    return error(errorType, errorValue);
  }
}
