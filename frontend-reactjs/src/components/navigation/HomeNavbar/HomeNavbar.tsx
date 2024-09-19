import { FaBell } from 'react-icons/fa'
import { RiLogoutCircleLine } from 'react-icons/ri'
import useLogout from '../../../hooks/useLogout'

const HomeNavbar = () => {
  const { loading, logout } = useLogout()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <button
          onClick={handleLogout}
          disabled={loading}
          className='btn btn-ghost text-xl'
        >
          <RiLogoutCircleLine />
        </button>
      </div>
      <div className='flex-none'>
        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn btn-ghost btn-circle'>
            <div className='indicator'>
              <FaBell />
              <span className='badge badge-sm indicator-item'>8</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-lg dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 shadow'
          >
            <li>
              <a>lg item 1</a>
            </li>
            <li>
              <a>lg item 2</a>
            </li>
          </ul>
        </div>
        <div className='dropdown dropdown-end'>
          <div
            tabIndex={0}
            role='button'
            className='btn btn-ghost btn-circle avatar'
          >
            <div className='w-10 rounded-full'>
              <img
                alt='Tailwind CSS Navbar component'
                src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'
          >
            <li>
              <a className='justify-between'>
                Profile
                <span className='badge'>New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HomeNavbar
