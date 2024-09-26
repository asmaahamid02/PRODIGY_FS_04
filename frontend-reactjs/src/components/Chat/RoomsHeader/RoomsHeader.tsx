import { FaPlus } from 'react-icons/fa'
import { useModalContext } from '../../../hooks/context/useModalContext'
import { useChatContext } from '../../../hooks/context/useChatContext'

const RoomsHeader = () => {
  const { openModal } = useModalContext()
  const { notifications } = useChatContext()

  const totalUnreadCount = notifications.reduce((total, room) => {
    return total + (room.unreadCount || 0)
  }, 0)
  return (
    <div className='flex items-center justify-between gap-1'>
      <div className='flex items-center gap-2'>
        <h1 className='text-lg md:text-xl font-bold'>My Chats</h1>
        {totalUnreadCount && totalUnreadCount > 0 ? (
          <div className='badge badge-accent text-xs'>{totalUnreadCount}</div>
        ) : null}
      </div>
      <button onClick={openModal} className='btn btn-circle btn-xs btn-primary'>
        <FaPlus />
      </button>
    </div>
  )
}

export default RoomsHeader
