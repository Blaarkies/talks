import {
  makeLoremIpsum,
  randomNumber,
} from '../../../../common';

export const entropyTextLow = 'the man plans a megaflopped panama canal and a cat naps on a tall sanded ' +
  'amp that does not go. the hemp camp had a champ that chomped on ectoplasm ' +
  'and flagstoned a tent. some megaphone champagnes do need a chef that has ' +
  'hands and cephalons. a canal can go on the cold stone and not on a flood ' +
  'of cats'
    .substring(0, 300);

export const entropyTextMid = makeLoremIpsum(50, {
  punctuationDensity: .5,
}).substring(0, 299) + '.';

export const entropyTextHigh = makeLoremIpsum(150, {
  punctuationDensity: .8,
  numbersDensity: .5,
  capitalizeDensity: .3,
}).split(' ')
  .map(w => {
    if (Math.random() < .9) {
      let highEntropyChar = String.fromCharCode(randomNumber(160, 255));
      let index = randomNumber(0, w.length);
      return w.substring(0, index) + highEntropyChar + w.substring(index + 1);
    }
    return w;
  })
  .filter(t => t)
  .join(' ')
  .substring(0, 299) + '.';