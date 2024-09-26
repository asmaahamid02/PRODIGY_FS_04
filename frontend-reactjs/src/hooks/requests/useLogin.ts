import { useState } from 'react'
import { useAuthContext } from '../context/useAuthContext'
import { IUser } from '../../types/user.type'
import { ILoginFormValues } from '../../types/login.type'
import { handleError } from '../../utils/error.util'
import { loginService } from '../../services/auth.service'
import { saveUserToLocalStorage } from '../../services/localStorage.service'
import toast from 'react-hot-toast'

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const login = async (data: ILoginFormValues) => {
    setLoading(true)

    try {
      const responseData = await loginService(data)

      if (responseData.error) {
        throw new Error(responseData.error)
      }

      saveUserToLocalStorage(responseData)
      setAuthUser(responseData as IUser)

      toast.success("You're logged into your account!")
    } catch (error) {
      handleError(error, 'Error in useLogin ~ login')
    } finally {
      setLoading(false)
    }
  }

  return { loading, login }
}

export default useLogin
