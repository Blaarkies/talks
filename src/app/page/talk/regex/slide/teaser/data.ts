const orwellA =
  `It was a bright cold day in April, and the clocks were striking thirteen. Winston
Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped
quickly through the glass doors of Victory Mansions, though not quickly enough
to prevent a swirl of gritty dust from entering along with him.
The hallway smelt of boiled cabbage and old rag mats. At one end of it a
coloured poster, too large for indoor display, had been tacked to the wall. It
depicted simply an enormous face, more than a metre wide: the face of a man of
about forty-five, with a heavy black moustache and ruggedly handsome features.
Winston made for the stairs. It was no use trying the lift. Even at the best
of times it was seldom working, and at present the electric current was cut off
during daylight hours. It was part of the economy drive in preparation for Hate
Week. The flat was seven flights up, and Winston, who was thirty-nine and had
a varicose ulcer above his right ankle, went slowly, resting several times on the
way. On each landing, opposite the lift-shaft, the poster with the enormous face
gazed from the wall. It was one of those pictures which are so contrived that
the eyes follow you about when you move. BIG BROTHER IS WATCHING
YOU, the caption beneath it ran.`;

const EOL = '\n';

export const mockTextA = orwellA;
export const mockTextIntFloat = orwellA
  .slice(0, 500)
  .replaceAll('thirteen', '13')
  .replaceAll('day in April', '4th of April')
  .replaceAll('the glass doors', 'the 3.1415 glass doors')
  .replaceAll('of gritty dust from', 'of gritty dust, with a count of 7, 3 managed')
;

/** Wraps long text to fit a `maxWidth` column */
export function getSizedMockText(maxWidth = 80, content = orwellA): string {
  const words = content.split(' ').flatMap(w => w.split(EOL));
  const lines: string[][] = [];
  for (const word of words) {
    let lastLine = lines.at(-1);
    if (!lastLine) {
      lines.push([word]);
      continue;
    }

    if (word === '') {
      lastLine.push(EOL);
      lines.push([]);
      continue;
    }

    const lastLineLength = lastLine.join(' ').length;
    if (lastLineLength + 1 + word.length <= maxWidth) {
      lastLine.push(word);
      continue;
    }

    lines.push([word]);
  }

  return lines.map(line => line.join(' ')).join(EOL);
}
