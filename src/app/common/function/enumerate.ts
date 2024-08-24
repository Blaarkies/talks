import { isArray } from './type-check';

export function makeNumberList(count: number, offset: number = 0): number[] {
  let safeCount = Math.round(count);
  let list = Array.from(Array(safeCount).keys());
  return offset
         ? list.map(n => n + offset)
         : list;
}

export function pickRandomElement<T>(list: T[]): T {
  let randomIndex = Math.round(Math.random() * (list.length - 1));
  return list[randomIndex];
}

export function sum(list: number[]): number {
  let sum = 0;
  for (let element of list) {
    sum += element;
  }
  return sum;
}

export function average(list: number[]): number {
  return sum(list) / list.length;
}

function getDifferences(list: number[]): number[] {
  return list
    .map((t, i, self) => self[i + 1] - t)
    .slice(0, -1);
}

export function derivatives(list: number[], n: number = 1): number[] {
  if (list.length <= n) {
    throw new Error(`[list](length=${list.length}) is too short for `
      + `calculations at derivative depth [${n}]`);
  }
  let resultList = list;
  for (let i = 0; i < n; i++) {
    resultList = getDifferences(resultList);
  }
  return resultList;
}

export function unique<T>(list: T[]): T[] {
  return Array.from(new Set(list));
}

/**
 * Given `list` of numbers, it returns the numbers that correspond
 * to gaps in the sequence
 */
export function findNumberGaps(list: number[]): number[] {
  let min = Math.min(...list);
  let max = Math.max(...list);

  return Array.from(
    Array(max - min),
    (_, i) => i + min).filter(i => !list.includes(i));
}

export function chunked<T>(list: T[], chunkSize = 2): T[][] {
  let chunks: T[][] = [];

  for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}

export function flattenNestedValues<T>(root: T, selector: (item: T) => T | T[])
  : T[] {
  let results = [];

  let queue = [root];
  while (queue.length) {
    let item = queue.shift();
    results.push(item);

    let nested = selector(item);
    if (!nested) {
      continue;
    }

    if (isArray(nested)) {
      queue.push(...nested);
    } else {
      queue.push(nested);
    }
  }

  return results;
}