import { useState } from 'react'
import { sendMessageService } from '../../services/message.service'
import { useChatContext } from '../context/useChatContext'

const useSendMessage = () => {
  const [loading, setLoading] = useState(false)
  const { setMessages, updateLastMessage } = useChatContext()

  const sendMessage = async (receiverId: string, message: string) => {
    setLoading(true)

    try {
      const response = await sendMessageService(receiverId, message)

      if ('error' in response) {
        throw new Error(response.error)
      }

      //update the last message of the room (on the sender side)
      updateLastMessage(response, false)

      //update messages array
      setMessages((prevMessages) => [...prevMessages, response])
    } catch (error: unknown) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return { loading, sendMessage }
}

export default useSendMessage
