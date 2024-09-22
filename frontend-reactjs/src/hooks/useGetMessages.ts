import { useSocketContext } from './useSocketContext'
import { useEffect, useState } from 'react'
import { useChatContext } from './useChatContext'
import { getMessagesService } from '../services/room.service'

const useGetMessages = () => {
  const [loading, setLoading] = useState(false)
  const { selectedRoom, setMessages } = useChatContext()
  const { socket } = useSocketContext()

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)

      try {
        const response = await getMessagesService(selectedRoom?._id as string)

        if ('error' in response) {
          throw new Error(response.error)
        }

        setMessages(response)

        socket?.emit('joinRoom', selectedRoom?._id)
      } catch (error: unknown) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    if (selectedRoom) {
      setMessages([])

      if (!selectedRoom.isFake) {
        fetchMessages()
      }
    }
  }, [selectedRoom, setMessages, socket])

  return { loading }
}

export default useGetMessages
