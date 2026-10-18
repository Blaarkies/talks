export type MatchedWord = {
  m: RegExpExecArray
  title: string
  word: string
  index: number
}

export type LightableContent = {
  id: number
  type: 'normal' | 'match' | 'cursor';
  content: string
  index: number
}

export type MatchedCategory = {
  title: string
  matches: {label: string, hide: boolean}[]
  hide: boolean
}
