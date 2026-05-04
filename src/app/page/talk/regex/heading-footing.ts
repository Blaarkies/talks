import { regexSlideRouteNames } from './route';

export const regexHeadingFootingMap = new Map<string, string[]>([
  [regexSlideRouteNames.teaser, [
    'REGULAR EXPRESSIONS',
    'LOADING...',
  ]],
  [regexSlideRouteNames.history, [
    'ORIGINS',
    'USE ARROW KEYS ← → TO ADVANCED FILM REEL',
  ]],
  [regexSlideRouteNames.basics, [
    'BASIC MATCHING',
    'USE ARROW KEYS ← → TO SELECT A PATTERN',
  ]],
  [regexSlideRouteNames.groups, [
    'CAPTURE GROUP',
    'USE ARROW KEYS ← → TO SELECT A PATTERN',
  ]],
  [regexSlideRouteNames.wildcards, [
    'WILDCARDS',
    'USE ARROW KEYS ← → TO SELECT A PATTERN',
  ]],
]);