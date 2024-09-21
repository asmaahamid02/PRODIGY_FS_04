import { FaBell } from 'react-icons/fa'
import { RiLogoutCircleLine } from 'react-icons/ri'
import useLogout from '../../../hooks/useLogout'
import ThemeSwitcher from '../../inputs/ThemeSwitcher'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { isDateLessThanHoursAgo } from '../../../utils/date.util'

const HomeNavbar = () => {
  const { loading, logout } = useLogout()
  const { authUser } = useAuthContext()

  const isNew = isDateLessThanHoursAgo(authUser?.createdAt as string)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className='shrink-0 navbar bg-base-100 px-4'>
      <div className='flex-1'>
        <button
          onClick={handleLogout}
          disabled={loading}
          className='btn btn-ghost text-xl'
        >
          <div className='tooltip tooltip-bottom' data-tip='Logout'>
            <RiLogoutCircleLine />
          </div>
        </button>
      </div>
      <div className='flex-none space-x-2'>
        <div className='btn btn-ghost btn-circle'>
          <ThemeSwitcher />
        </div>
        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn btn-ghost btn-circle'>
            <div className='indicator'>
              <FaBell className='w-5 h-5' />
              <span className='badge badge-sm indicator-item'>8</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 shadow'
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
              <img alt={authUser?.fullName} src={authUser?.profilePicture} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'
          >
            <li>
              <a className='justify-between'>
                {authUser?.fullName}
                {isNew && <span className='badge'>New</span>}
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
