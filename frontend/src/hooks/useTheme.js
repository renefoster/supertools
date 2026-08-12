import { useEffect, useState } from 'react'

const key = 'supertools-theme'

function initialTheme() {
  const saved = localStorage.getItem(key)
  return saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

export function useTheme() {
  const [theme, setTheme] = useState(initialTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(key, theme)
  }, [theme])
  return { theme, toggleTheme: () => setTheme((value) => value === 'dark' ? 'light' : 'dark') }
}
