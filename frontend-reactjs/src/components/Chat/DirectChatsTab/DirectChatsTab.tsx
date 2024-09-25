import UserItem from '../UserItem'
import useSearchUsers from '../../../hooks/requests/useSearchUsers'
import { useState } from 'react'
import SearchInput from '../../inputs/SearchInput'
import Spinner from '../../utils/Spinner'
import { useModalContext } from '../../../hooks/context/useModalContext'
import useGetRoom from '../../../hooks/requests/useGetRoom'
import { IUser } from '../../../types/user.type'

const DirectChatsTab = () => {
  const { users, loading, searchUsers } = useSearchUsers()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    searchUsers(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const { loading: loadingRoom, getRoom } = useGetRoom()
  const { closeModal } = useModalContext()

  const handleUserClick = async (user: IUser) => {
    if (loading) return
    await getRoom(user._id)
    closeModal()
  }

  return (
    <>
      <SearchInput
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
      />

      {searchQuery && (
        <div className='mt-4 space-y-4 overflow-y-auto'>
          {loading ? (
            <Spinner />
          ) : (
            <>
              {users.length > 0 ? (
                <>
                  {users.map((user) => (
                    <UserItem
                      key={user._id}
                      user={user}
                      onClick={handleUserClick}
                      loading={loadingRoom}
                    />
                  ))}
                </>
              ) : (
                <p className='text-center'>No users found</p>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

export default DirectChatsTab
