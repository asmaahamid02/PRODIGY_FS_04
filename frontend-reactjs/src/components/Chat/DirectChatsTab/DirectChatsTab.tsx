import UserItem from '../UserItem'
import useSearchUsers from '../../../hooks/requests/useSearchUsers'
import { useState } from 'react'
import SearchInput from '../../inputs/SearchInput'
import Spinner from '../../utils/Spinner'

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

  return (
    <div>
      <SearchInput
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
      />

      {searchQuery && (
        <div className='mt-4 space-y-4'>
          {loading ? (
            <Spinner />
          ) : (
            <>
              {users.length > 0 ? (
                <>
                  {users.map((user) => (
                    <UserItem key={user._id} user={user} />
                  ))}
                </>
              ) : (
                <p className='text-center'>No users found</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default DirectChatsTab
