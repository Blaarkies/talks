const orwellA = `
It was a bright cold day in April, and the clocks were striking thirteen. Winston
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
YOU, the caption beneath it ran.`.trim();

const hexdump = `
00000000  49 74 20 77 61 73 20 61  20 62 72 69 67 68 74 20  |It was a bright |
00000010  63 6f 6c 64 20 64 61 79  20 69 6e 20 41 70 72 69  |cold day in Apri|
00000020  6c 2c 20 61 6e 64 20 74  68 65 20 63 6c 6f 63 6b  |l, and the clock|
00000030  73 20 77 65 72 65 20 73  74 72 69 6b 69 6e 67 20  |s were striking |
00000040  74 68 69 72 74 65 65 6e  2e 20 57 69 6e 73 74 6f  |thirteen. Winsto|
00000050  6e 0a 53 6d 69 74 68 2c  20 68 69 73 20 63 68 69  |n.Smith, his chi|
00000060  6e 20 6e 75 7a 7a 6c 65  64 20 69 6e 74 6f 20 68  |n nuzzled into h|
00000070  69 73 20 62 72 65 61 73  74 20 69 6e 20 61 6e 20  |is breast in an |
00000080  65 66 66 6f 72 74 20 74  6f 20 65 73 63 61 70 65  |effort to escape|
00000090  20 74 68 65 20 76 69 6c  65 20 77 69 6e 64 2c 20  | the vile wind, |
000000a0  73 6c 69 70 70 65 64 0a  71 75 69 63 6b 6c 79 20  |slipped.quickly |
000000b0  74 68 72 6f 75 67 68 20  74 68 65 20 67 6c 61 73  |through the glas|
000000c0  73 20 64 6f 6f 72 73 20  6f 66 20 56 69 63 74 6f  |s doors of Victo|
000000d0  72 79 20 4d 61 6e 73 69  6f 6e 73 2c 20 74 68 6f  |ry Mansions, tho|
000000e0  75 67 68 20 6e 6f 74 20  71 75 69 63 6b 6c 79 20  |ugh not quickly |
000000f0  65 6e 6f 75 67 68 0a 74  6f 20 70 72 65 76 65 6e  |enough.to preven|
00000100  74 20 61 20 73 77 69 72  6c 20 6f 66 20 67 72 69  |t a swirl of gri|
00000110  74 74 79 20 64 75 73 74  20 66 72 6f 6d 20 65 6e  |tty dust from en|
00000120  74 65 72 69 6e 67 20 61  6c 6f 6e 67 20 77 69 74  |tering along wit|
00000130  68 20 68 69 6d 2e 0a                              |h him..|
00000137
`.trim();

const EOL = '\n';

export const mockTextA = orwellA;
export const mockTextIntFloat = orwellA
  .slice(0, 500)
  .replaceAll('thirteen', '13')
  .replaceAll('day in April', '4th of April')
  .replaceAll('the glass doors', 'the 3.1415 glass doors')
  .replaceAll('of gritty dust from', 'of gritty dust, with a count of 7, 3 managed')
;
export const mockTextHex = hexdump;

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
