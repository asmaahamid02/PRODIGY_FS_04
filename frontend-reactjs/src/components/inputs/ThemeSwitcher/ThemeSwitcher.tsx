import { MdOutlineWbSunny } from 'react-icons/md'
import useThemeToggle from '../../../hooks/useThemeToggle'
import { IoMoon } from 'react-icons/io5'

const ThemeSwitcher = () => {
  const { theme, handleThemeChange } = useThemeToggle()

  return (
    <label className='swap swap-rotate'>
      {/* this hidden checkbox controls the state */}
      <input
        type='checkbox'
        className='theme-controller'
        value={theme}
        onChange={handleThemeChange}
      />

      {/* sun icon */}
      <MdOutlineWbSunny className='swap-off h-5 w-5 fill-current' />

      {/* moon icon */}
      <IoMoon className='swap-on h-5 w-5 fill-current' />
    </label>
  )
}

export default ThemeSwitcher
