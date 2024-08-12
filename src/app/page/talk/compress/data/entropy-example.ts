import {
  makeLoremIpsum,
  randomNumber,
} from '../../../../common';

export const entropyTextLow = `
This house is falling in space above the air and around the Earth. People
made it to fly up in space boats and stay inside it People and things
inside it stay in the air instead of falling to the floor Inside the house
things like water and people fly around when kicking off the walls. People
inside the house work and play and take pictures of Earth
`.trim().toLowerCase().replaceAll('\n', ' ')
  .substring(0, 300);

export const entropyTextMid = `
The International Space Station (ISS) is a large space station assembled
and maintained in low Earth orbit by a collaboration of five space
agencies and their contractors: NASA (United States), Roscosmos (Russia),
ESA (Europe), JAXA (Japan), and CSA (Canada). The ISS is the largest
space station ever built. Its primary purpose is to perform microgravity
and space environment experiments.[12]
`.replaceAll('\n', ' ').substring(0, 299) + '.';

export const entropyTextHigh = makeLoremIpsum(150, {
  punctuationDensity: .8,
  numbersDensity: .5,
  capitalizeDensity: .3,
}).split(' ')
  .map(w => {
    let index = randomNumber(0, w.length);
    return w.substring(0, index - 1)
      + w.substring(index, index + 2).toUpperCase()
      + w.substring(index + 2);
  })
  .map(w => {
    if (Math.random() < .8) {
      let highEntropyChar = String.fromCharCode(randomNumber(160, 255));
      let index = randomNumber(0, w.length);
      return w.substring(0, index) + highEntropyChar + w.substring(index + 1);
    }
    return w
  })
  .filter(t => t)
  .join(' ')
  .substring(0, 299) + '.';