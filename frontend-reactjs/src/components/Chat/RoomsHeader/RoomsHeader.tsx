import { FaPlus } from 'react-icons/fa'
import { useChatContext } from '../../../hooks/context/useChatContext'
import { useModalContext } from '../../../hooks/context/useModalContext'

const RoomsHeader = () => {
  const { totalUnreadMessages } = useChatContext()
  const { openModal } = useModalContext()

  return (
    <div className='flex items-center justify-between gap-1'>
      <div className='flex items-center gap-2'>
        <h1 className='text-lg md:text-xl font-bold'>My Chats</h1>
        {totalUnreadMessages && totalUnreadMessages > 0 ? (
          <div className='badge badge-accent text-xs'>
            {totalUnreadMessages}
          </div>
        ) : null}
      </div>
      <button onClick={openModal} className='btn btn-circle btn-xs btn-primary'>
        <FaPlus />
      </button>
    </div>
  )
}

export default RoomsHeader
