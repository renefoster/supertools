import { tools } from './tools'

export const navGroups = Object.entries(tools.reduce((groups, tool) => {
  groups[tool.category] ??= []
  groups[tool.category].push(tool)
  return groups
}, {})).map(([category, items]) => ({ category, items }))
