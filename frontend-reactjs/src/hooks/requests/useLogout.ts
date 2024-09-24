import { useState } from 'react'
import { useAuthContext } from '../context/useAuthContext'
import { removeUserFromLocalStorage } from '../../services/localStorage.service'
import toast from 'react-hot-toast'
import { useChatContext } from '../context/useChatContext'

const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()
  const { setSelectedRoom } = useChatContext()

  const logout = async () => {
    setLoading(true)

    setTimeout(() => {
      removeUserFromLocalStorage()
      setAuthUser(null)
      setSelectedRoom(null)
      setLoading(false)
      toast.success('You have been logged out!')
    }, 1000)
  }

  return { loading, logout }
}

export default useLogout
