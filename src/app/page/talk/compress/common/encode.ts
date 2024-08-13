import { sep } from '../../../../common';

export function splitStringToRunLengthEncoding(data: string): string[] {
  let imageString = data.split('');
  let results = [];
  let lastList = [];
  for (let c of imageString) {
    let lastChar = lastList[0];
    if (!lastList.length
      || lastChar === c
      || c === sep) {
      lastList.push(c);
      continue;
    }

    results.push(lastList.join(''));
    lastList = [c];
  }
  results.push(lastList.join(''));
  return results;
}