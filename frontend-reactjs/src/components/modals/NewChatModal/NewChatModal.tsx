import { forwardRef, useState } from 'react'
// import Tabs from '../../utils/Tabs'
import DirectChatsTab from '../../Chat/DirectChatsTab'
import GroupChatsTab from '../../Chat/GroupChatsTab'
import { IoMdClose } from 'react-icons/io'

const NewChatModal = forwardRef<HTMLDialogElement>((_, ref) => {
  const [selectedTab] = useState(0)

  return (
    <dialog ref={ref} className='modal max-w-full'>
      <div className='modal-box'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            <IoMdClose />
          </button>
        </form>
        <h3 className='font-bold text-lg'>Start New Chat</h3>
        <div className='flex flex-col gap-2 mt-2'>
          {/* <Tabs
            tabs={['Direct', 'Group']}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          /> */}

          <div className='mt-4' role='tabpanel'>
            {selectedTab === 0 ? <DirectChatsTab /> : <GroupChatsTab />}
          </div>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  )
})

export default NewChatModal
