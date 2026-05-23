export type LightableContent = {
  id: number
  type: 'normal' | 'match' | 'cursor';
  content: string
}

export type MatchedWord = {
  i: number
  regex: RegExpExecArray
  title: string
}

export type MatchedCategory = {
  title: string
  matches: {label: string, hide: boolean}[]
  hide: boolean
}
