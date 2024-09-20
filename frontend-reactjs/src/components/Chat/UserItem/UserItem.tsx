import { FC } from 'react'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { isDateLessThanHoursAgo } from '../../../utils/date.util'
import { IUser } from '../../../types/user.type'

interface UserItemProps {
  user: IUser
}

const UserItem: FC<UserItemProps> = ({ user }) => {
  const { authUser } = useAuthContext()

  const isNew = isDateLessThanHoursAgo(authUser?.createdAt as string)

  return (
    <div
      className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-base-300 cursor-pointer transition-colors bg-base-100`}
    >
      <div className='flex items-center space-x-2'>
        {/* AVATAR */}
        <div className='avatar'>
          <div className='w-10 md:w-12 rounded-full'>
            <img src={user.profilePicture} alt={user.fullName} />
          </div>
        </div>
        <div>
          <h4 className='md:text-lg font-bold'>{user.fullName}</h4>
          <p className='text-sm'>{user.username}</p>
        </div>
      </div>
      {isNew && (
        <div className='space-y-2 flex flex-col items-end'>
          <div className='badge badge-accent'>new</div>
        </div>
      )}
    </div>
  )
}

export default UserItem
