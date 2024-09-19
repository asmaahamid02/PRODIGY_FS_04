import ThemeSwitcher from '../../inputs/ThemeSwitcher'

const AuthNavbar = () => {
  return (
    <div className='shrink-0 navbar bg-base-100 px-4'>
      <div className='flex-1'>
        <a className='btn btn-ghost text-xl'>Connectify</a>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <ThemeSwitcher />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AuthNavbar
