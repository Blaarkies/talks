import { sep } from '../../../../common';
import { unprintableCharLabelMap } from '../data/ascii-table';
import {
  dataToList,
  toFrequencies,
} from './entropy';

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

export function toBinary(value: string, bitLength = 8): string {
  return value
    .charCodeAt(0)
    .toString(2)
    .padStart(bitLength, '0');
}

interface HcTreeNode {
  char?: string;
  children?: HcTreeNode[];
  usage: number;
  path?: string;
}

interface HcDictionaryItem {
  char: string;
  path: string;
  usage: number;
  label: string;
}

type HcDictionary = Map<string, HcDictionaryItem>;
type HcTreeRoot = HcTreeNode[];

export function toHuffmanTree(text: string | number[]): HcTreeRoot {
  let frequencies = toFrequencies(text);

  let frequencyList = Object.entries(frequencies)
    .sort(([, freqA], [, freqB]) => freqA - freqB);

  let list: HcTreeNode[] = frequencyList.map(([char, usage]) =>
    ({char, usage}));

  while (list.length > 2) {
    let a = list.pop();
    let b = list.pop();

    let node: HcTreeNode = {
      children: [a, b],
      usage: a.usage + b.usage,
    };

    let sortedIndex = list.findIndex(e => e.usage < node.usage);
    if (sortedIndex === -1) {
      sortedIndex = list.length;
    }

    list.splice(sortedIndex, 0, node);
  }

  let huffmanCodingTree: HcTreeRoot = list;
  return huffmanCodingTree;
}

export function toHuffmanDictionary(root: HcTreeRoot): HcDictionary {
  let endNodes = setBitPaths({children: root, usage: 0});

  let defs = endNodes
    .sort((a, b) => b.usage - a.usage)
    .map(node => ({
      char: node.char,
      usage: node.usage,
      label: unprintableCharLabelMap.get(node.char.charCodeAt(0)) ?? node.char,
      path: node.path,
    }));
  return new Map(defs.map(n => [n.char, n]));
}

function setBitPaths(node: HcTreeNode, path: string = ''): HcTreeNode[] {
  node.path = path;

  if (!node.children) {
    return [node];
  }

  let a = node.children[0];
  let b = node.children[1];

  return [
    ...setBitPaths(a, path + '0'),
    ...setBitPaths(b, path + '1'),
  ];
}

export function encodeToHuffmanCoding(data: string | number[],
                                      dictionary?: HcDictionary) {
  if (!dictionary) {
    dictionary = toHuffmanDictionary(toHuffmanTree(data));
  }

  let list = dataToList(data);

  return list.map(c => dictionary.get(c.toString()).path);
}
