import { SplitSection } from '@talk/regex/common/match-split';

export type PitfallSplitSection = {
  id: SplitSection['id']
  type?:
    | SplitSection['type']
    | 'regex-display'
  content: SplitSection['content']
  group?: SplitSection['group']
}