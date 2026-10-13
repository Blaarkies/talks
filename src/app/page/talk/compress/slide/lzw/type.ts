export type CodeDisplay = {
  current: string
  next: string
  output: string
  add: string
  id: number
}

export type AnimationState = 'past' | 'present' | 'future'

export type CodeWithState = CodeDisplay & { state: AnimationState }
