import { useChatContext } from '../../hooks/context/useChatContext'
import useRoomInfo from '../../hooks/useRoomInfo'
import { IRoom } from '../../types/chat.type'
import Avatar from '../Avatar'
import moment from 'moment'

const NotificationItem = ({ notification }: { notification: IRoom }) => {
  const { setSelectedRoom } = useChatContext()
  const { chatName, profilePicture } = useRoomInfo({ room: notification })

  const sSuffix = (notification?.unreadCount as number) > 1 ? 's' : ''
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
      <div className='flex-1 flex items-center space-x-2 max-w-full'>
        {/* AVATAR */}
        <Avatar src={profilePicture as string} alt={chatName as string} />

        <div className='flex-1'>
          <h4 className='line-clamp-2 w-full'>
            {notification.isGroup ? (
              <>
                {title}
                <span className='font-bold text-accent'>{chatName}</span>
              </>
            ) : (
              <>
                <span className='font-bold text-accent'>{chatName}</span>
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
