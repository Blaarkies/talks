import {
  isArray,
  isString,
  sum,
} from '../../../../common';

type FrequencyRecord = Record<string, number>;

export function dataToList(input: string | number[]): (string | number)[] {
  let data = [];
  if (isString(input)) {
    data = input.split('');
  } else if (isArray(input)) {
    data = input;
  }

  return data;
}

export function toFrequencies(input: string | number[]): FrequencyRecord {
  let data = dataToList(input);

  let allFrequencies: FrequencyRecord = {};
  for (const d of data) {
    let value = allFrequencies[d];
    allFrequencies[d] = value === undefined ? 1 : value + 1;
  }
  return allFrequencies;
}

export function toEntropyInBytes(input: string | number[] | BinaryData)
  : number {
  let data: string | number[];

  if (typeof input === 'string' || isArray(input)) {
    data = input;
  } else if (ArrayBuffer.isView(input)) {
    data = Array.from(new Uint8Array(input.buffer));
  }

  let allFrequencies = toFrequencies(data);

  let allFrequenciesValues = Object.values(allFrequencies);
  let sumOfFrequencies = sum(allFrequenciesValues);

  let bits = allFrequenciesValues.reduce((sum, v) => {
      let p = v / sumOfFrequencies;
      return sum - (p * Math.log(p) / Math.log(2));
    },
    0);

  return Math.ceil((bits * sumOfFrequencies) / 8);
}