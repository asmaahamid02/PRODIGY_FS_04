import { useAuthContext } from '../../hooks/context/useAuthContext'
import { useChatContext } from '../../hooks/context/useChatContext'
import { IRoom } from '../../types/chat.type'
import Avatar from '../Avatar'
import moment from 'moment'

const NotificationItem = ({ notification }: { notification: IRoom }) => {
  const { authUser } = useAuthContext()
  const { setSelectedRoom } = useChatContext()

  const senderName = notification.isGroup
    ? notification.groupName
    : notification.participants.find((p) => p._id !== authUser?._id)?.fullName

  const sSuffix = notification?.unreadCount ?? 0 > 1 ? 's' : ''
  const title = notification.isGroup
    ? `${notification.unreadCount} message${sSuffix} sent in `
    : ` sent you ${notification.unreadCount} message${sSuffix}`

  const onClick = () => {
    setSelectedRoom(notification)
  }

  return (
    <li
      className='flex flex-row flex-nowrap justify-between w-full rounded-lg cursor-pointer transition-colors max-w-full'
      role='button'
      onClick={onClick}
    >
      <div className='flex items-center space-x-2 max-w-full'>
        {/* AVATAR */}
        <Avatar src={'#'} alt='John Doe' />

        <div className='flex-1'>
          <h4 className='font-bold line-clamp-2'>
            {notification.isGroup ? (
              <>
                <span className='font-normal text-accent'>{senderName}</span>
                {title}
              </>
            ) : (
              <>
                <span className='font-normal text-accent'>{senderName}</span>
                {title}
              </>
            )}
          </h4>
          <p className='text-xs line-clamp-1'>
            {moment(notification?.lastMessage?.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </li>
  )
}

export default NotificationItem
