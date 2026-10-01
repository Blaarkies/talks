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
    'USE ARROW KEYS ← → TO INTRODUCE A PATTERN',
  ]],
  [slideRoutePaths.groups, [
    'CAPTURE GROUPS',
    'USE ARROW KEYS ← → TO SELECT A PATTERN',
  ]],
  [slideRoutePaths.wildcards, [
    'CHARACTER CLASSES',
    'USE ARROW KEYS ← → TO SELECT A CLASS',
  ]],
  [slideRoutePaths.flags, [
    'CONFIGURATION FLAGS',
    'USE ARROW KEYS ← → TO LEARN MORE ABOUT EACH FLAG',
  ]],
  [slideRoutePaths.pitfalls, [
    'PITFALLS',
    'USE ARROW KEYS ← → TO SEE MORE PITFALLS',
  ]],
  [slideRoutePaths.readingRegex, [
    'READING REGEX',
    'USE ARROW KEYS ← → TO PRACTICE UNDERSTANDING A REGEX PATTERN',
  ]],

  [slideRoutePaths.end, [
    'THANK YOU',
    'USE ↰ TO GO BACK TO MAIN MENU',
  ]],
]);