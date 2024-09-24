import { useSocketContext } from '../context/useSocketContext'
import { useEffect, useState } from 'react'
import { useChatContext } from '../context/useChatContext'
import { getMessagesService } from '../../services/room.service'

const useGetMessages = () => {
  const [loading, setLoading] = useState(false)
  const { selectedRoom, setMessages, setTotalUnreadMessages, setRooms } =
    useChatContext()
  const { socket } = useSocketContext()

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)

      try {
        const response = await getMessagesService(selectedRoom?._id as string)

        if ('error' in response) {
          throw new Error(response.error)
        }

        //update room unread messages
        const unreadCount = selectedRoom?.unreadCount as number
        setRooms((prevRooms) => {
          const updatedRooms = prevRooms.map((room) => {
            if (room._id === selectedRoom?._id) {
              return { ...room, unreadCount: 0 }
            }

            return room
          })

          return updatedRooms
        })

        //update total unread messages
        if (setTotalUnreadMessages) {
          setTotalUnreadMessages((prevCount) => {
            console.log('prevCount', prevCount)
            return prevCount > unreadCount ? prevCount - unreadCount : 0
          })
        }

        setMessages(response)
      } catch (error: unknown) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    if (selectedRoom) {
      setMessages([])

      fetchMessages()
    }
  }, [selectedRoom, setMessages, socket, setTotalUnreadMessages, setRooms])

  return { loading }
}

export default useGetMessages
