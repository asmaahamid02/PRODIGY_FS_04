import { MdOutlineWbSunny } from 'react-icons/md'
import { IoMoon } from 'react-icons/io5'
import { useThemeContext } from '../../../hooks/context/useThemeContext'
import { ChangeEvent } from 'react'

const ThemeSwitcher = () => {
  const { theme, handleThemeChange } = useThemeContext()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    handleThemeChange(e.target.value)

  return (
    <label className='swap swap-rotate'>
      {/* this hidden checkbox controls the state */}
      <input
        type='checkbox'
        className='theme-controller'
        value={theme}
        onChange={handleChange}
      />

      {/* sun icon */}
      <MdOutlineWbSunny className='swap-off h-5 w-5 fill-current' />

      {/* moon icon */}
      <IoMoon className='swap-on h-5 w-5 fill-current' />
    </label>
  )
}

export default ThemeSwitcher
