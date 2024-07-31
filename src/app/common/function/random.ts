import { loremIpsumWords } from '../data/word-list';

export function makeLoremIpsum(wordCount: number): string {
  const randomWords: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * loremIpsumWords.length);
    randomWords.push(loremIpsumWords[randomIndex]);
  }

  return randomWords.join(' ');
}