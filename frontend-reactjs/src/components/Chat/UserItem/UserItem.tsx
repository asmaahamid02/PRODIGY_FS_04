import { FC } from 'react'
import { isDateLessThanHoursAgo } from '../../../utils/date.util'
import { IUser } from '../../../types/user.type'
import useGetRoom from '../../../hooks/requests/useGetRoom'
import { useModalContext } from '../../../hooks/context/useModalContext'
import Spinner from '../../utils/Spinner'
import Avatar from '../../Avatar'

interface UserItemProps {
  user: IUser
}

const UserItem: FC<UserItemProps> = ({ user }) => {
  const { loading, getRoom } = useGetRoom()
  const { closeModal } = useModalContext()

  const isNew = isDateLessThanHoursAgo(user.createdAt as string, 24)

  const handleUserClick = async () => {
    if (loading) return
    await getRoom(user._id)
    closeModal()
  }

  return (
    <div
      className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-base-300 cursor-pointer transition-colors bg-base-100 max-w-full`}
      role='button'
      onClick={handleUserClick}
    >
      <div className='flex items-center space-x-2'>
        {/* AVATAR */}
        <Avatar src={user.profilePicture} alt={user.fullName} />

        <div>
          <h4 className='md:text-lg font-bold'>{user.fullName}</h4>
          <p className='text-sm'>{user.username}</p>
        </div>
      </div>
      {isNew && (
        <div className='space-y-2 flex flex-col items-end'>
          <div className='badge badge-secondary'>new</div>
        </div>
      )}
      {loading && <Spinner />}
    </div>
  )
}

export default UserItem
