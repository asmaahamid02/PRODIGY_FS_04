import { IMessage } from '../types/chat.type'
import { API_ENDPOINTS } from '../utils/constants.util'
import { api } from './api.service'

export const sendMessageService = async (
  roomId: string,
  message: string
): Promise<
  | IMessage
  | {
      error: string
    }
> => {
  const response = await api.post(`${API_ENDPOINTS.MESSAGES}/send/${roomId}`, {
    message,
  })
  return response.data
}
