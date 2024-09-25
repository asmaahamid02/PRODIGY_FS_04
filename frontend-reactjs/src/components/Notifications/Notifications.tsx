import { useChatContext } from '../../hooks/context/useChatContext'
import NotificationItem from '../NotificationItem'
import { FaBell } from 'react-icons/fa'

const Notifications = () => {
  const { notifications } = useChatContext()

  return (
    <div className='dropdown dropdown-end'>
      <summary tabIndex={0} className='btn btn-ghost btn-circle'>
        <div className='indicator'>
          <FaBell />
          {notifications.length > 0 && (
            <span className='badge badge-sm indicator-item badge-primary'>
              {notifications.length}
            </span>
          )}
        </div>
      </summary>
      <ul
        tabIndex={0}
        className='dropdown-content space-y-3 z-[1] mt-2 shadow-lg menu menu-md bg-base-200 rounded-box w-full sm:w-80'
      >
        {notifications.length === 0 && (
          <li>
            <span className='text-lg w-full text-center'>
              No notifications!
            </span>
          </li>
        )}

        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
          />
        ))}
      </ul>
    </div>
  )
}

export default Notifications
