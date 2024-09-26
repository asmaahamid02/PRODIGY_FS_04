import { forwardRef } from 'react'
// import Tabs from '../../utils/Tabs'
import { IoMdClose } from 'react-icons/io'
import { useChatContext } from '../../../hooks/context/useChatContext'
import useRoomInfo from '../../../hooks/useRoomInfo'
import { IRoom } from '../../../types/chat.type'
import GroupChatTab from '../../Chat/GroupChatsTab'

const UpdateGroupModal = forwardRef<HTMLDialogElement>((_, ref) => {
  const { selectedRoom } = useChatContext()
  const { chatName } = useRoomInfo({
    room: selectedRoom as IRoom,
  })

  return (
    <dialog ref={ref} className='modal max-w-full'>
      <div className='modal-box overflow-x-hidden'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            <IoMdClose />
          </button>
        </form>
        <h3 className='font-bold text-lg'>{`${chatName} info`}</h3>
        <div className='space-y-2 mt-2'>
          <div className='mt-4'>
            <GroupChatTab isEdit={true} />
          </div>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  )
})

export default UpdateGroupModal
