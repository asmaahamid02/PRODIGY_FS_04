import { useSocketContext } from '../context/useSocketContext'
import { useEffect } from 'react'
import { useChatContext } from '../context/useChatContext'
import { getMessagesService } from '../../services/room.service'
import { handleError } from '../../utils/error.util'

const useGetMessages = () => {
  const { selectedRoom, setMessages, setRooms, setLoadingMessages } =
    useChatContext()
  const { socket } = useSocketContext()

  useEffect(() => {
    const fetchMessages = async () => {
      if (setLoadingMessages) setLoadingMessages(true)
      try {
        const response = await getMessagesService(selectedRoom?._id as string)

        if ('error' in response) {
          throw new Error(response.error)
        }

        //update room unread messages
        setRooms((prevRooms) => {
          const updatedRooms = prevRooms.map((room) => {
            if (room._id === selectedRoom?._id) {
              return { ...room, unreadCount: 0 }
            }

            return room
          })

          return updatedRooms
        })

        setMessages(response)
      } catch (error: unknown) {
        handleError(error, 'Error in useGetMessages ~ fetchMessages')
      } finally {
        if (setLoadingMessages) setLoadingMessages(false)
      }
    }

    if (selectedRoom) {
      setMessages([])
      fetchMessages()
    }
  }, [selectedRoom, setMessages, socket, setRooms, setLoadingMessages])
}

export default useGetMessages
