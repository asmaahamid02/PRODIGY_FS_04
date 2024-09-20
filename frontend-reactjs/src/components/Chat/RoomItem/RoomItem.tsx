import { FC } from 'react'
import { useChatContext } from '../../../hooks/useChatContext'
import { IRoom } from '../../../types/chat.type'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { formateDateToHoursAndMinutes } from '../../../utils/date.util'

interface IRoomItemProps {
  room: IRoom
}

const RoomItem: FC<IRoomItemProps> = ({ room }) => {
  const { selectedRoom } = useChatContext()
  const { authUser } = useAuthContext()

  const isGroup = room?.isGroup
  const sender = isGroup
    ? null
    : room.participants.find((user) => user._id !== authUser?._id)

  const chatName = isGroup ? room.groupName : sender?.fullName
  const lastMessage = room.lastMessage
  const lastMessageText = lastMessage?.message
    ? lastMessage.message
    : 'No messages yet'
  const lastMessageTime = lastMessage?.createdAt
    ? formateDateToHoursAndMinutes(lastMessage.createdAt)
    : ''

  const formattedChatName = chatName?.split(' ').join('+')
  const profilePicture = isGroup
    ? `https://avatar.iran.liara.run/username?username=${formattedChatName}`
    : sender?.profilePicture

  return (
    <div
      className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-base-300 cursor-pointer transition-colors ${
        selectedRoom ? 'bg-base-200' : 'bg-base-100'
      }`}
    >
      <div className='flex items-center space-x-2'>
        {/* AVATAR */}
        <div className='avatar online'>
          <div className='w-10 md:w-12 rounded-full'>
            <img src={profilePicture} alt={chatName} />
          </div>
        </div>
        <div>
          <h4 className='md:text-lg font-bold'>{chatName}</h4>
          <p className='text-sm'>{lastMessageText}</p>
        </div>
      </div>
      <div className='space-y-2 flex flex-col items-end'>
        <p className='text-xs'>{lastMessageTime}</p>
        <div className='badge badge-accent text-xs'>2</div>
      </div>
    </div>
  )
}

export default RoomItem
