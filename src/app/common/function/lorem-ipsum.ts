import { loremIpsumWords } from '../data/word-list';
import { pickRandomElement } from './enumerate';
import { randomNumber } from './random';

interface Config {
  punctuationDensity?: number;
  numbersDensity?: number;
  capitalizeDensity?: number;
}

const punctuations = {
  pair: {
    doubleQuote: [`"`, `"`],
    quotes: [`'`, `'`],
    parenthesis: [`(`, `)`],
    squareBrackets: [`[`, `]`],
    braces: [`{`, `}`],
    angleBrackets: [`<`, `>`],
  },
  single: {
    ending: {
      comma: `,`,
      period: `.`,
      exclamation: `!`,
      question: `?`,
      semiColon: `;`,
      colon: `:`,
    },
    connecting: {
      hyphen: `-`,
      slash: `/`,
      and: ` & `,
    },
  },
};

export function makeLoremIpsum(wordCount: number, config: Config = {}): string {
  let randomWords: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * loremIpsumWords.length);
    randomWords.push(loremIpsumWords[randomIndex]);
  }

  if (config.capitalizeDensity) {
    let density = config.capitalizeDensity;
    randomWords = randomWords.map(w => {
      if (Math.random() < density) {
        return w[0].toUpperCase() + w.slice(1);
      }
      return w;
    });
  }

  if (config.punctuationDensity) {
    let density = config.punctuationDensity;
    let pairs = Object.entries(punctuations.pair);
    let singles = Object.entries(punctuations.single);
    let pairSize = (1.5 - density) * 5;

    randomWords = randomWords.reduce((sum, c, i) => {
      if (sum.nextJob) {
        let job = sum.nextJob;
        if (i < job.i) {
          sum.result.push(c);
          return sum;
        }
        sum.result.push(job.fn(c));
        sum.nextJob = undefined;

        return sum;
      }

      if (Math.random() < density) {

        if (i < (wordCount - pairSize) && Math.random() < .5) {
          // Pairs
          let job = pickRandomElement(pairs)[1];
          sum.result.push(job[0] + c);

          let closeIndex = Math.round(i + randomNumber(0, pairSize));
          sum.nextJob = {
            i: closeIndex,
            fn: w => w + job[1],
          };
        } else {
          // Singles
          let jobType = pickRandomElement(singles);
          let job = pickRandomElement(
            Object.entries(jobType[1]))[1];

          if (jobType[0] === 'ending') {
            sum.result.push(c + job);
          }

          if (jobType[0] === 'connecting') {
            sum.nextJob = {
              i: i + 1,
              fn: w => c + job + w,
            };
          }
        }

        return sum;
      }

      sum.result.push(c);

      return sum;
    }, <{ result: string[], nextJob?: { i, fn: Function } }>{result: []})
      .result;
  }

  if (config.numbersDensity) {
    let density = config.numbersDensity;
    let maxDigitsCount = Math.ceil(density * 5);

    randomWords = randomWords.reduce((sum, c, i) => {
      if (Math.random() < density) {
        let digitsCount = Math.round(randomNumber(1, maxDigitsCount));
        let numbers = Math.random().toString();
        let length = numbers.length;
        let numberString = numbers.substring(length - digitsCount, length);

        sum.push(numberString);
      }

      sum.push(c);

      return sum;
    }, []);
  }

  return randomWords.join(' ');
}