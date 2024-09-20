import { IRoom } from '../types/chat.type'
import { API_ENDPOINTS } from '../utils/constants.util'
import { api } from './api.service'

export const getRoomsService = async (): Promise<IRoom[]> => {
  const response = await api.get(API_ENDPOINTS.ROOMS)
  return response.data
}
