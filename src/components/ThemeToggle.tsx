import { useEffect, useState } from 'react'
import { Moon, Sun } from './Icons'

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#171210' : '#fdf8f1')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* 忽略隐私模式下的写入失败 */
    }
  }, [theme])

  return (
    <button
      type="button"
      className={`theme-toggle${theme === 'dark' ? ' is-dark' : ''}`}
      onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
      aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
      title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
    >
      <span className="theme-toggle__icon theme-toggle__icon--sun">
        <Sun />
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--moon">
        <Moon />
      </span>
    </button>
  )
}
