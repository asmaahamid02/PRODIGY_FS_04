import { RiLogoutCircleLine } from 'react-icons/ri'
import useLogout from '../../../hooks/requests/useLogout'
import ThemeSwitcher from '../../inputs/ThemeSwitcher'
import { useAuthContext } from '../../../hooks/context/useAuthContext'
import Notifications from '../../Notifications'

const HomeNavbar = () => {
  const { logout, loading } = useLogout()
  const { authUser } = useAuthContext()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className='navbar bg-base-100 px-4'>
      <div className='flex-1'>
        <div className='tooltip tooltip-right me-2' data-tip='Logout'>
          <button
            disabled={loading}
            onClick={handleLogout}
            className='btn btn-ghost btn-circle'
          >
            <RiLogoutCircleLine />
          </button>
        </div>
        <div className='tooltip tooltip-right me-2' data-tip='Change theme'>
          <div className='btn btn-ghost btn-circle'>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      <div className='flex-none space-x-2'>
        <Notifications />
        <div className='flex flex-col items-end'>
          <h4 className='font-bold'>{authUser?.fullName}</h4>
          <p className='text-xs'>{authUser?.username}</p>
        </div>
        <div
          tabIndex={0}
          role='button'
          className='btn btn-ghost btn-circle avatar'
        >
          <div className='w-10 rounded-full'>
            <img alt={authUser?.fullName} src={authUser?.profilePicture} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeNavbar
