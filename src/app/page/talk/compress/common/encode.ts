import { sep } from '../../../../common';
import { unprintableCharLabelMap } from '../data/ascii-table';
import {
  Data,
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

export interface Nested<T> {
  children: T[];
}

interface HcTreeNode extends Partial<Nested<HcTreeNode>> {
  char?: string;
  frequency: number;
  path?: string;
  parent?: HcTreeNode;
  label?: string;
}

interface HcDictionaryItem {
  char: string;
  path: string;
  frequency: number;
  label: string;
}

type HcDictionary = Map<string, HcDictionaryItem>;

export function toHuffmanTree(data: Data): HcTreeNode {
  let frequencies = toFrequencies(data);

  let frequencyList = Object.entries(frequencies)
    .sort(([cA, fA], [cB, fB]) => (fB - fA) || ((cB > cA) ? 1 : -1));

  let list: HcTreeNode[] = frequencyList
    .map(([char, frequency]) => ({char, frequency}));

  while (list.length > 1) {
    let a = list.pop();
    let b = list.pop();

    let node: HcTreeNode = {
      children: [a, b].sort((a,b)=> b.frequency - a.frequency),
      frequency: a.frequency + b.frequency,
    };

    a.parent = node;
    b.parent = node;

    let sortedIndex = list.findIndex(e => e.frequency < node.frequency);
    if (sortedIndex === -1) {
      sortedIndex = list.length;
    }

    list.splice(sortedIndex, 0, node);
  }

  let tree = list[0] as HcTreeNode;
  setBitPathsGetNodes(tree, true);

  return tree;
}

function setBitPathsGetNodes(
  node: HcTreeNode,
  onlyEndNodes = false,
  path: string = ''): HcTreeNode[] {
  node.path = path;

  if (!node.children) {
    return [node];
  }

  let [a, b] = node.children;
  let childNodes = [
    ...setBitPathsGetNodes(a, onlyEndNodes, path + '0'),
    ...setBitPathsGetNodes(b, onlyEndNodes, path + '1'),
  ];

  return onlyEndNodes ? childNodes : childNodes.concat([node]);
}

export function toHuffmanDictionary(root: HcTreeNode): HcDictionary {
  let endNodes = setBitPathsGetNodes(root, true);

  let defs = endNodes
    .sort((a, b) => b.frequency - a.frequency)
    .map(node => ({
      char: node.char,
      frequency: node.frequency,
      label: unprintableCharLabelMap.get(node.char.charCodeAt(0)) ?? node.char,
      path: node.path,
    }));
  return new Map(defs.map(n => [n.char, n]));
}

export function encodeToHuffmanCoding(
  data: Data,
  dictionary?: HcDictionary): string[] {
  if (!dictionary) {
    dictionary = toHuffmanDictionary(toHuffmanTree(data));
  }

  let list = dataToList(data);

  return list.map(c => dictionary.get(c.toString()).path);
}
