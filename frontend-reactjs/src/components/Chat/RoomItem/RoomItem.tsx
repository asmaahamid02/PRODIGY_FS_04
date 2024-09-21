import { FC } from 'react'
import { useChatContext } from '../../../hooks/useChatContext'
import { IRoom } from '../../../types/chat.type'
import useRoomInfo from '../../../hooks/useRoomInfo'
interface IRoomItemProps {
  room: IRoom
}

const RoomItem: FC<IRoomItemProps> = ({ room }) => {
  const { setSelectedRoom } = useChatContext()
  const {
    chatName,
    profilePicture,
    lastMessageText,
    lastMessageTime,
    isSelected,
  } = useRoomInfo({ room })

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
        <div className='avatar online'>
          <div className='w-10 md:w-12 rounded-full'>
            <img src={profilePicture} alt={chatName} />
          </div>
        </div>
        <div className='flex-1 overflow-hidden'>
          <h4 className='md:text-lg font-bold truncate'>{chatName}</h4>
          <p className='text-sm truncate'>
            {lastMessageText.length > 50
              ? lastMessageText.substring(0, 51)
              : lastMessageText}
          </p>
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
