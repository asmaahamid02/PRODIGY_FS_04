import { ChangeEvent, useEffect, useState } from 'react'

const useThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  const handleThemeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.body.classList.toggle('dark', theme === 'dark')
    document.querySelector('html')?.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, handleThemeChange }
}

export default useThemeToggle
