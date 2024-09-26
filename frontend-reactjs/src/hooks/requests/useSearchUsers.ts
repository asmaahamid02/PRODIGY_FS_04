import { useCallback, useEffect, useMemo, useState } from 'react'
import { IUser } from '../../types/user.type'
import { handleError } from '../../utils/error.util'
import { searchUsersService } from '../../services/user.service'

const useSearchUsers = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<IUser[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const debounceTimeout = 500

  const searchUsers = useCallback((search: string) => {
    {
      if (!search.trim()) {
        setUsers([])
        return
      }

      setLoading(true)

      const performSearch = async () => {
        try {
          const response = await searchUsersService(search)

          if ('error' in response) {
            throw new Error(response.error)
          }

          setUsers(response)
        } catch (error) {
          handleError(error, 'Error in useSearchUsers hook ~ searchUsers')
        } finally {
          setLoading(false)
        }
      }

      performSearch()
    }
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch) {
        searchUsers(debouncedSearch)
      }
    }, debounceTimeout)

    return () => {
      clearTimeout(handler)
    }
  }, [debouncedSearch, searchUsers])

  const handleSearch = useCallback((search: string) => {
    setDebouncedSearch(search)
  }, [])

  return useMemo(
    () => ({ users, loading, searchUsers: handleSearch }),
    [users, loading, handleSearch]
  )
}

export default useSearchUsers
