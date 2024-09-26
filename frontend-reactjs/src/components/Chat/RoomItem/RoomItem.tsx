import { FC } from 'react'
import { useChatContext } from '../../../hooks/context/useChatContext'
import { IRoom } from '../../../types/chat.type'
import useRoomInfo from '../../../hooks/useRoomInfo'
import Avatar from '../../Avatar'
interface IRoomItemProps {
  room: IRoom
}

const RoomItem: FC<IRoomItemProps> = ({ room }) => {
  const { setSelectedRoom, notifications } = useChatContext()
  const {
    isGroup,
    chatName,
    profilePicture,
    lastMessageText,
    lastMessageTime,
    isSelected,
    isOnline,
    typing,
    typingUser,
    lastMessage,
    isLastMessageRead,
    isLastMessageSentByMe,
  } = useRoomInfo({ room })

  const unreadCount =
    notifications.find((n) => n._id === room._id)?.unreadCount ?? 0

  return (
    <div
      className={`flex items-center justify-between w-full p-2 gap-1 rounded-lg hover:bg-base-300 cursor-pointer transition-colors ${
        isSelected ? 'bg-base-200' : 'bg-base-100'
      }`}
      role='button'
      onClick={() => setSelectedRoom(room)}
    >
      <div className='flex items-center space-x-2 max-w-[75%]'>
        {/* AVATAR */}
        <Avatar
          src={profilePicture as string}
          alt={chatName as string}
          isOnline={isOnline}
          displayOnline={!isGroup}
        />

        <div className='flex-1 overflow-hidden'>
          <h4 className='md:text-lg font-bold truncate'>{chatName}</h4>
          {typing ? (
            <p className='text-sm text-base-400 flex items-center gap-1 text-accent'>
              {typingUser && `${typingUser.fullName.split(' ')[0]} is`} typing
              <span className='loading loading-dots loading-sm'></span>
            </p>
          ) : (
            <p
              className={`text-sm truncate ${
                !isLastMessageRead && 'text-accent'
              }`}
            >
              {isLastMessageSentByMe ? (
                <span className='font-medium'>You: </span>
              ) : isGroup && lastMessage ? (
                <span className='font-medium'>
                  {lastMessage.sender.fullName.split(' ')[0]}
                  {': '}
                </span>
              ) : null}
              {lastMessageText.length > 50
                ? lastMessageText.substring(0, 51)
                : lastMessageText}
            </p>
          )}
        </div>
      </div>
      <div className='space-y-2 flex flex-col items-end'>
        <p
          className={`text-xs ${isLastMessageRead === false && 'text-accent'}`}
        >
          {lastMessageTime}
        </p>
        {unreadCount && unreadCount > 0 ? (
          <div className='badge badge-accent text-xs'>{unreadCount}</div>
        ) : null}
      </div>
    </div>
  )
}

export default RoomItem
