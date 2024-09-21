import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { logoutService } from '../services/auth.service'
import { removeUserFromLocalStorage } from '../services/localStorage.service'
import toast from 'react-hot-toast'
import { handleError } from '../utils/error.util'
import { useNavigate } from 'react-router-dom'
import { PathConstants } from '../routes/PathConstants'

const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const logout = async () => {
    setLoading(true)

    // try {
    //   const responseData = await logoutService()

    //   if (responseData.error) {
    //     throw new Error(responseData.error)
    //   }

    removeUserFromLocalStorage()
    setAuthUser(null)

    //   toast.success("You're logged out of your account!")
    // } catch (error) {
    //   handleError(error, 'Error in useLogin ~ login')
    // } finally {
    //   setLoading(false)
    // }
  }

  return { loading, logout }
}

export default useLogout
