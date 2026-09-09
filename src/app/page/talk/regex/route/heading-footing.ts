import { slideRoutePaths } from './slide-definition';

export const headingFootingMap = new Map<string, string[] | null>([
  [slideRoutePaths.opening, null],
  [slideRoutePaths.introduction, null],
  [slideRoutePaths.closing, null],

  [slideRoutePaths.teaser, [
    'REGULAR EXPRESSIONS',
    'LOADING...',
  ]],
  [slideRoutePaths.history, [
    'ORIGINS',
    'USE ARROW KEYS ← → TO ADVANCED FILM REEL',
  ]],
  [slideRoutePaths.basics, [
    'BASIC MATCHING',
    'USE ARROW KEYS ← → TO SELECT A PATTERN',
  ]],
  [slideRoutePaths.groups, [
    'CAPTURE GROUP',
    'USE ARROW KEYS ← → TO SELECT A PATTERN',
  ]],
  [slideRoutePaths.wildcards, [
    'WILDCARDS',
    'USE ARROW KEYS ← → TO SELECT A PATTERN',
  ]],
  [slideRoutePaths.flags, [
    'CONFIGURATION FLAGS',
    'USE ARROW KEYS ← → TO SELECT A FLAG',
  ]],
  [slideRoutePaths.pitfalls, [
    'PITFALLS',
    'USE ARROW KEYS ← → TO SEE MORE PITFALLS',
  ]],
  [slideRoutePaths.readingRegex, [
    'READING REGEX',
    'TODO',
  ]],


  [slideRoutePaths.end, [
    'THANK YOU',
    'USE ↰ TO GO BACK TO MAIN MENU',
  ]],
]);