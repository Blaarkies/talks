export type HotkeyLabel = {
  label: string
  hotkey: string
  skip?: number
}

export type ActionItem = {
  hotkeyLabel: HotkeyLabel
  action?: () => void
}

export type TaskBarMenuConfig = {
  title: HotkeyLabel
  items: ActionItem[]
}

export type HighlightSection = {
  content: string
  highlight?: boolean
}