import { sep } from '../../../../common';

export function getRunLengthEncodings(data: string)
  : {encodings: [number, string][], width: number} {
  if (data.includes(sep)) {
    throw new Error(
      'Bad input data. Data contained an end-of-line character');
  }

  let indexOfWidthTag = data.indexOf('W');
  if (indexOfWidthTag < 0) {
    throw new Error(
      'Bad input data. [W] tag to denote image width was not found');
  }

  let width = parseInt(data.slice(0, indexOfWidthTag));
  if (!Number.isInteger(width) || width < 0) {
    throw new Error(
      'Bad input data. [Width] is not a positive integer');
  }

  let runLengths = data.slice(indexOfWidthTag + 1).split('');
  let digits = '';
  let encodings = [];
  for (let char of runLengths) {
    if (Number.isInteger(parseInt(char))) {
      digits += char;
      continue;
    }

    let count = parseInt(digits);
    if (!Number.isInteger(count)) {
      throw new Error(`Bad input data. [${char}] is not a valid run count`)
    }
    encodings.push([count, char]);
    digits = '';
  }

  return {encodings, width};
}

export function tryWrappedGetRunLengthEncodings(data: string)
  : ReturnType<typeof getRunLengthEncodings> {
  try {
    return getRunLengthEncodings(data);
  } catch (e) {
    console.info(e);
    return {encodings: [], width: 0};
  }
}

export function decodeRunLength(data: string): string {
  let {encodings, width} = tryWrappedGetRunLengthEncodings(data);

  let flatRun: string[] = encodings
    .reduce((sum, [count, char]) =>
      sum += char.repeat(count), '')
    .split('');

  let index = width;
  while (index < flatRun.length) {
    flatRun.splice(index, 0, sep);
    index += width + 1;
  }

  return flatRun.join('');
}