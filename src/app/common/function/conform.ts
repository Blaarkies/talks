export function coerceBetween(value: number,
                              min: number,
                              max: number,
                              isExclusive?: boolean): number {
  return isExclusive
         ? Math.max(Math.min(value, max), min)
         : Math.min(Math.max(value, min), max);
}
