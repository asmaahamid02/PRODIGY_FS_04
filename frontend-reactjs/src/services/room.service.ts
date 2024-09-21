import { IMessage, IRoom } from '../types/chat.type'
import { API_ENDPOINTS } from '../utils/constants.util'
import { api } from './api.service'

export const getRoomsService = async (): Promise<IRoom[]> => {
  const response = await api.get(API_ENDPOINTS.ROOMS)
  return response.data
}

export const getRoomService = async (
  receiverId: string
): Promise<
  | IRoom
  | {
      error: string
    }
> => {
  const response = await api.get(`${API_ENDPOINTS.ROOMS}/${receiverId}`)
  return response.data
}

export const getMessagesService = async (
  roomId: string
): Promise<
  | IMessage[]
  | {
      error: string
    }
> => {
  const response = await api.get(`${API_ENDPOINTS.ROOMS}/${roomId}/messages`)
  return response.data
}
