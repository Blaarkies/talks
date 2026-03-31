export function coerceBetween(value: number,
                              min: number,
                              max: number,
                              isExclusive?: boolean): number {
  return isExclusive
         ? Math.max(Math.min(value, max), min)
         : Math.min(Math.max(value, min), max);
}

export function coerceAtLeast(value: number, min = 0): number {
  return Math.max(min, value);
}

export function coerceAtMost(value: number, max = 1): number {
  return Math.min(max, value);
}

export function isBetween(it: number,
                          min: number,
                          max: number,
                          isExclusive?: boolean): boolean {
  return isExclusive
         ? it > min && it < max
         : it >= min && it <= max;
}