import { makeNumberList } from '@app/common';

export type SplitSection = {
  id: number
  type?: 'match'
  content: string
  group?: string
}

/** @deprecated Use matchSplitGroup() */
export function matchSplitSimple(content: string, regex: RegExp, idSeed = 0)
  : SplitSection[] {
  let textSupply = content;
  const sections = [];
  const matches = textSupply.match(regex);

  let id = idSeed;

  if (matches) {
    for (const match of matches.filter(Boolean)) {
      const index = textSupply.indexOf(match);
      const before = textSupply.slice(0, index);

      sections.push(
        {id: ++id, content: before},
        {id: ++id, type: 'match', content: match});

      textSupply = textSupply.slice(index + match.length);
    }
  }

  sections.push({id: ++id, content: textSupply});

  return sections;
}

/** Does not support nested groups */
export function matchSplitGroup(
  content: string, regex: RegExp, idSeed = 0,
  skipGroupCount: number | number[] = 1)
  : SplitSection[] {
  const sections: SplitSection[] = [];
  const matchesUnfiltered = regex.global
                  ? Array.from(content.matchAll(regex))
                  : [content.match(regex)];
  const matches = matchesUnfiltered.filter(Boolean);

  let id = idSeed;

  const cleanSkip = typeof skipGroupCount === 'number'
  ? [skipGroupCount] : skipGroupCount;
  if (matches.some(m => m.slice(...cleanSkip).length)) {
    const categories = makeNumberList(26).map(n => String.fromCharCode(n + 97));
    let cursor = 0;

    for (const m of matches) {
      const beforeMatch = content.slice(cursor, m.index);
      sections.push({id: ++id, content: beforeMatch});
      cursor = m.index;

      for (const [i, g] of m.slice(...cleanSkip).entries()) {
        if (!g) continue;

        const index = content.indexOf(g, cursor);
        if (index === -1 || index < cursor) continue;

        const beforeGroup = content.slice(cursor, index);
        cursor = index + g.length;

        if (beforeGroup) {
          sections.push({id: ++id, content: beforeGroup});
        }

        sections.push({
            id: ++id,
            content: g,
            type: 'match',
            group: categories[i],
          });
      }
    }

    sections.push({id: ++id, content: content.slice(cursor)});

  } else {

    sections.push({id: ++id, content});
  }

  return sections.filter(s => s.content);
}