import { FC } from 'react'
import { isDateLessThanHoursAgo } from '../../../utils/date.util'
import { IUser } from '../../../types/user.type'
import Spinner from '../../utils/Spinner'
import Avatar from '../../Avatar'

interface UserItemProps {
  user: IUser
  onClick: (user: IUser) => void
  loading?: boolean
}

const UserItem: FC<UserItemProps> = ({ user, onClick, loading }) => {
  const isNew = isDateLessThanHoursAgo(user.createdAt as string, 24)

  return (
    <div
      className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-base-300 cursor-pointer transition-colors bg-base-100 max-w-full`}
      role='button'
      onClick={() => onClick(user)}
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
