import { compressionSlideRouteNames } from './route';

export const pathToHeadingFootingMap = new Map<string, string[]>([
  [compressionSlideRouteNames.teaser, [
    'THE ART OF SAVING SPACE',
    'USE ARROW KEYS ← → TO SEND THE DISK FROM ALICE TO BOB',
  ]],
  [compressionSlideRouteNames.entropy, [
    'DEFINING INFORMATION',
    'USE ARROW KEYS ← → TO VIEW NEXT ENTROPY EXAMPLE',
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
  [compressionSlideRouteNames.aiAndCompression, [
    'AI COMPRESSION',
    'USE ARROW KEYS ← → TO PROGRESS',
  ]],
  [compressionSlideRouteNames.lzw, [
    'LZW - PATTERN SUBSTITUTION',
    'USE ARROW KEYS ← → TO ENCODE OR RESET',
  ]],
  [compressionSlideRouteNames.otherAlgorithms, [
    'COMMON ALGORITHMS',
    'PRACTICE LOOKING AT WINDOWS',
  ]],
  [compressionSlideRouteNames.end, [
    'THANK YOU',
    'USE ↰ TO GO BACK TO MAIN MENU',
  ]],
  [compressionSlideRouteNames.calculatingEntropy, [
    'CALCULATING ENTROPY',
    'HAMMER THE COIN TO FLIP',
  ]],
]);