import {
  isArray,
  isString,
  sum,
} from '../../../../common';

export function getEntropyScore(input: string | number[]): number {
  let data = [];
  if (isString(input)) {
    data = input.split('').map(c => c.charCodeAt(0));
  } else if (isArray(input)) {
    data = input;
  }

  let allFrequencies: Record<string, number> = {};
  for (const d of data) {
    let value = allFrequencies[d];
    allFrequencies[d] = value === undefined ? 1 : value + 1;
  }

  let allFrequenciesValues = Object.values(allFrequencies);
  let sumOfFrequencies = sum(allFrequenciesValues);

  let bits = allFrequenciesValues.reduce((sum, v) => {
      let p = v / sumOfFrequencies;
      return sum - (p * Math.log(p) / Math.log(2));
    },
    0);

  return Math.ceil((bits * sumOfFrequencies) / 8);
}