type SplitSection = {
  id: number
  type: undefined | 'match'
  content: string
}

export function matchSplit(content: string, regex: RegExp, idSeed = 0)
  : SplitSection[] {
  let textSupply = content;
  const sections = [];
  const matches = textSupply.match(regex);

  let id = idSeed;
  for (const match of matches.filter(Boolean)) {
    const index = textSupply.indexOf(match);
    const before = textSupply.slice(0, index);

    sections.push(
      {id: ++id, content: before},
      {id: ++id, type: 'match', content: match});

    textSupply = textSupply.slice(index + match.length);
  }

  sections.push({id: ++id, content: textSupply});

  return sections;
}