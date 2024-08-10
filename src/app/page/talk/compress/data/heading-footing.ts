import { compressionSlideRouteNames } from '../slide/route';

export const pathToHeadingFootingMap = new Map<string, string[]>([
  [compressionSlideRouteNames.teaser, [
    'Welcome, Data Compression!',
    'Alice sends a zip file to Bob'
  ]],
  [compressionSlideRouteNames.entropy, [
    'Defining Information',
    'Entropy is a measure of pure information'
  ]],
]);