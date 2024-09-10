import { compressionSlideRouteNames } from './route';

export const pathToHeadingFootingMap = new Map<string, string[]>([
  [compressionSlideRouteNames.teaser, [
    'WELCOME, DATA COMPRESSION!',
    'USE ARROW KEYS ← → TO SEND THE DISK FROM ALICE TO BOB',
  ]],
  [compressionSlideRouteNames.entropy, [
    'DEFINING INFORMATION',
    'USE ARROW KEYS ← → TO VIEW THE NEXT ENTROPY EXAMPLE',
  ]],
  [compressionSlideRouteNames.runLengthEncoding, [
    'RUN-LENGTH ENCODING',
    'USE MOUSE HOVER TO HIGHLIGHT ENCODING RUNS',
  ]],
  [compressionSlideRouteNames.asciiInBinary, [
    'ASCII, BINARY, CHARACTER',
    'USE ARROW KEYS ← → TO PAGE AND MOUSE OVER TO HIGHLIGHT',
  ]],
  [compressionSlideRouteNames.huffmanCodingDictionary, [
    'HUFFMAN CODING',
    'USE ARROW KEYS ← → TO OPEN AND MOUSE OVER TO HIGHLIGHT',
  ]],
  [compressionSlideRouteNames.huffmanCodingTree, [
    'BUILDING THE DICTIONARY',
    'ENTER OR MOUSE CLICK BOTTOM ROW TO SUM PAIR',
  ]],
]);