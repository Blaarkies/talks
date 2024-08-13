import { compressionSlideRouteNames } from '../slide/route';

export const pathToHeadingFootingMap = new Map<string, string[]>([
  [compressionSlideRouteNames.teaser, [
    'WELCOME, DATA COMPRESSION!',
    'USE ARROW KEYS ← → TO PROGRESS THE COMPRESSION'
  ]],
  [compressionSlideRouteNames.entropy, [
    'DEFINING INFORMATION',
    'USE ARROW KEYS ← → TO VIEW THE NEXT ENTROPY EXAMPLE'
  ]],
  [compressionSlideRouteNames.runLengthEncoding, [
    'RUN-LENGTH ENCODING',
    'USE MOUSE HOVER TO HIGHLIGHT ENCODING RUNS',
  ]],
]);