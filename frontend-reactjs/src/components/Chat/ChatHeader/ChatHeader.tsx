import { useChatContext } from '../../../hooks/useChatContext'
import useRoomInfo from '../../../hooks/useRoomInfo'
import { IRoom } from '../../../types/chat.type'
import { FaArrowLeft, FaEye } from 'react-icons/fa'
import Avatar from '../../Avatar'

const ChatHeader = () => {
  const { selectedRoom } = useChatContext()
  const { chatName, profilePicture } = useRoomInfo({
    room: selectedRoom as IRoom,
  })

  return (
    <div className='flex shrink-0 px-3 py-2 items-center justify-between w-full border-b-base-300 border-b'>
      {/* BACK BUTTON */}
      {selectedRoom && (
        <button className='btn btn-ghost me-2 md:hidden'>
          <FaArrowLeft />
        </button>
      )}

      <div className='flex-1 flex items-center space-x-2'>
        {/* AVATAR */}
        <Avatar
          src={profilePicture as string}
          alt={chatName as string}
          width='w-10 md:w-12'
          isOnline={true}
        />
        <div className='flex-1'>
          <h2 className='text-lg md:text-xl font-bold'>{chatName}</h2>
          <p className='text-sm text-base-400'>Typing...</p>
        </div>
      </div>

      {/* VIEW PROFILE BUTTON */}
      <button className='btn btn-ghost'>
        <FaEye />
      </button>
    </div>
  )
}

export default ChatHeader
