import { useChatContext } from '../../../hooks/context/useChatContext'
import useRoomInfo from '../../../hooks/useRoomInfo'
import { IRoom } from '../../../types/chat.type'
import { FaArrowLeft, FaEye } from 'react-icons/fa'
import Avatar from '../../Avatar'
import { useRef } from 'react'
import RoomInfoModal from '../../modals/RoomInfoModal'
import UpdateGroupModal from '../../modals/UpdateGroupModal'
import { IoMdSettings } from 'react-icons/io'
import { useAuthContext } from '../../../hooks/context/useAuthContext'

const ChatHeader = () => {
  const { selectedRoom, setSelectedRoom } = useChatContext()
  const { chatName, profilePicture, isOnline, typing, typingUser, isGroup } =
    useRoomInfo({
      room: selectedRoom as IRoom,
    })
  const { authUser } = useAuthContext()

  const isAuthUserAdmin = selectedRoom?.groupAdmin?._id === authUser?._id

  const infoModalRef = useRef<HTMLDialogElement>(null)
  const updateModalRef = useRef<HTMLDialogElement>(null)

  const openInfoModal = () => {
    if (infoModalRef.current) {
      infoModalRef.current.showModal()
    }
  }

  const openUpdateModal = () => {
    if (updateModalRef.current) {
      updateModalRef.current.showModal()
    }
  }

  return (
    <>
      <div className='flex shrink-0 px-3 py-2 items-center justify-between w-full border-b-base-300 border-b'>
        {/* BACK BUTTON */}
        {selectedRoom && (
          <button
            className='btn btn-ghost me-2 md:hidden'
            onClick={() => setSelectedRoom(null)}
          >
            <FaArrowLeft />
          </button>
        )}

        <div className='flex-1 flex items-center space-x-2'>
          {/* AVATAR */}
          <Avatar
            src={profilePicture as string}
            alt={chatName as string}
            width='w-10 md:w-12'
            isOnline={isOnline}
            displayOnline={!isGroup}
          />
          <div className='flex-1'>
            <h2 className='text-lg md:text-xl font-bold'>{chatName}</h2>
            {typing ? (
              <p className='text-sm text-base-400 flex items-center gap-1 text-accent'>
                {typingUser && `${typingUser.fullName} is`} typing
                <span className='loading loading-dots loading-sm'></span>
              </p>
            ) : !isGroup ? (
              <>
                {isOnline ? (
                  <p className='text-sm text-accent'>Online</p>
                ) : (
                  <p className='text-sm text-error'>Offline</p>
                )}
              </>
            ) : (
              <p className='text-sm text-base-400'>
                {selectedRoom?.participants.length} members
              </p>
            )}
          </div>
        </div>

        {/* VIEW PROFILE BUTTON */}
        {isGroup && (
          <div className='flex items-center gap-2'>
            {isAuthUserAdmin && (
              <button className='btn btn-ghost' onClick={openUpdateModal}>
                <IoMdSettings />
              </button>
            )}
            <button className='btn btn-ghost' onClick={openInfoModal}>
              <FaEye />
            </button>
          </div>
        )}
      </div>

      <RoomInfoModal ref={infoModalRef} />
      {isAuthUserAdmin && <UpdateGroupModal ref={updateModalRef} />}
    </>
  )
}

export default ChatHeader
