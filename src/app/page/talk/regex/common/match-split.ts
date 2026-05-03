type SplitSection = {
  id: number
  type?: 'match'
  content: string
  group?: string
}

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

export function matchSplitGroup(content: string, regex: RegExp, idSeed = 0)
  : SplitSection[] {
  let textSupply = content;
  const sections: SplitSection[] = [];
  const matches = regex.global
                  ? Array.from(textSupply.matchAll(regex))
                  : [textSupply.match(regex)];

  let id = idSeed;

  if (matches) {
    matches.filter(Boolean)
      .flatMap(gs => gs.slice(1).map((g, i) => ({g, i})))
      .forEach(({g, i}) => {
        const index = textSupply.indexOf(g);
        const before = textSupply.slice(0, index);

        sections.push(
          {id: ++id, content: before},
          {
            id: ++id,
            content: g,
            type: 'match',
            group: String.fromCharCode(i + 97),
          });

        textSupply = textSupply.slice(index + (g?.length ?? 0));
      });
  }

  sections.push({id: ++id, content: textSupply});

  return sections;
}