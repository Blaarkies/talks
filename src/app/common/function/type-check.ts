export function isString(obj: unknown): obj is string {
  return (typeof obj === 'string' || obj instanceof String);
}

export function isArray(obj: unknown): obj is Array<unknown> {
  return Array.isArray(obj);
}
