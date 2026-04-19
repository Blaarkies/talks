import {
  regexSlideRouteNames,
} from './route';

export const regexHeadingFootingMap = new Map<string, string[]>([
  [regexSlideRouteNames.teaser, [
    'REGULAR EXPRESSIONS',
    'LOADING...',
  ]],
  [regexSlideRouteNames.history, [
    'CREATING A STANDARD',
    'USE ARROW KEYS ← → TO ADVANCED FILM REEL',
  ]],
]);