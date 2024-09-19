import { ILoginFormValues } from '../types/login.type'
import { ISignupFormValues } from '../types/signup.type'
import { IAuthResponse } from '../types/user.type'
import { API_ENDPOINTS } from '../utils/constants.util'
import { api } from './api.service'

export const signupService = async (
  data: ISignupFormValues
): Promise<IAuthResponse> => {
  const response = await api.post(API_ENDPOINTS.SIGNUP, data)
  return response.data
}

export const loginService = async (
  data: ILoginFormValues
): Promise<IAuthResponse> => {
  const response = await api.post(API_ENDPOINTS.LOGIN, data)
  return response.data
}

export const logoutService = async (): Promise<{
  message: string
  error: string
}> => {
  const response = await api.post(API_ENDPOINTS.LOGOUT)
  return response.data
}
