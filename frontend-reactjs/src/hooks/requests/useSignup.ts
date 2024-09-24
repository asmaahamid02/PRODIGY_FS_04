import { useState } from 'react'
import { signupService } from '../../services/auth.service'
import { ISignupFormValues } from '../../types/signup.type'
import { useAuthContext } from '../context/useAuthContext'
import { IUser } from '../../types/user.type'
import { handleError } from '../../utils/error.util'
import { saveUserToLocalStorage } from '../../services/localStorage.service'
import toast from 'react-hot-toast'

const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const signup = async (data: ISignupFormValues) => {
    try {
      const responseData = await signupService(data)

      if (responseData.error) {
        throw new Error(responseData.error)
      }

      saveUserToLocalStorage(responseData)
      setAuthUser(responseData as IUser)

      toast.success("You're registered to Connectify!")
    } catch (error) {
      handleError(error, 'Error in useLogin ~ login')
    } finally {
      setLoading(false)
    }
  }

  return { loading, signup }
}

export default useSignup
