import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

type ThemeContextType = {
  theme: string
  setTheme: Dispatch<SetStateAction<string>>
  handleThemeChange: (value: string) => void
}

const initialState: ThemeContextType = {
  theme: '',
  setTheme: () => {},
  handleThemeChange: () => {},
}
export const ThemeContext = createContext<ThemeContextType>(initialState)

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('theme') || 'light'
  )

  const handleThemeChange = (value: string) => {
    if (value === 'light') setTheme('dark')
    else setTheme('light')
  }

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.body.classList.toggle('dark', theme === 'dark')
    document.querySelector('html')?.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  )
}
