import { forwardRef } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useChatContext } from '../../../hooks/context/useChatContext'
import useRoomInfo from '../../../hooks/useRoomInfo'
import { IRoom } from '../../../types/chat.type'
import Avatar from '../../Avatar'
import useGroupRequests from '../../../hooks/requests/useGroupRequests'
import { useAuthContext } from '../../../hooks/context/useAuthContext'

const RoomInfoModal = forwardRef<HTMLDialogElement>((_, ref) => {
  const { selectedRoom } = useChatContext()
  const { authUser } = useAuthContext()
  const { chatName, profilePicture } = useRoomInfo({
    room: selectedRoom as IRoom,
  })
  const { loading, leaveGroup } = useGroupRequests()

  const isAdmin = selectedRoom?.groupAdmin?._id === authUser?._id
  return (
    <dialog ref={ref} className='modal max-w-full'>
      <div className='modal-box overflow-x-hidden'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            <IoMdClose />
          </button>
        </form>
        <h3 className='font-bold text-lg'>{`${chatName} info`}</h3>
        <div className='space-y-4 mt-2'>
          <div className='flex items-center flex-col gap-2'>
            <Avatar
              src={profilePicture as string}
              alt={chatName as string}
              width='w-20'
              displayOnline={false}
            />
            <h3 className='font-bold text-xl'>{chatName}</h3>
          </div>
          <div>
            <h4 className='font-bold'>Members</h4>
            <div className='mt-4 space-y-4'>
              {selectedRoom?.participants.map((participant) => (
                <div
                  key={participant._id}
                  className='flex items-center space-x-2'
                >
                  <Avatar
                    src={participant.profilePicture as string}
                    alt={participant.username}
                    width='w-8'
                    displayOnline={false}
                  />
                  <div>
                    <p>
                      {participant.fullName}{' '}
                      {isAdmin && (
                        <div className='badge badge-outline badge-primary text-xs'>
                          Admin
                        </div>
                      )}
                    </p>
                    <p className='text-xs'>{participant.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedRoom?.isGroup && (
            <div className='flex justify-end'>
              <button
                className='btn btn-error'
                disabled={loading}
                onClick={() => leaveGroup(selectedRoom._id)}
              >
                Leave Group
              </button>
            </div>
          )}
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  )
})

export default RoomInfoModal
