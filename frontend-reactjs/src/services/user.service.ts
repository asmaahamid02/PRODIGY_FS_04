import { IUser } from '../types/user.type'
import { API_ENDPOINTS } from '../utils/constants.util'
import { api } from './api.service'

export const searchUsersService = async (
  search: string
): Promise<IUser[] | { error: string }> => {
  const response = await api.get(`${API_ENDPOINTS.USERS}?search=${search}`)
  return response.data
}
