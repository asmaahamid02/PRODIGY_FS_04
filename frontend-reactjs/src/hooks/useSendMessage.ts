import { useState } from 'react'
import { sendMessageService } from '../services/message.service'
import { IRoom } from '../types/chat.type'
import { useChatContext } from './useChatContext'

const useSendMessage = () => {
  const [loading, setLoading] = useState(false)
  const {
    setMessages,
    selectedRoom,
    setSelectedRoom,
    setRooms,
    updateLastMessage,
  } = useChatContext()

  const sendMessage = async (receiverId: string, message: string) => {
    setLoading(true)

    try {
      const response = await sendMessageService(receiverId, message)

      if ('error' in response) {
        throw new Error(response.error)
      }

      //check if the selected room is fake
      if (selectedRoom?.isFake) {
        //remove the fake room and push the new one
        setRooms((prevRooms) => [
          response.room as IRoom,
          ...prevRooms.filter((room) => room._id !== selectedRoom._id),
        ])

        setSelectedRoom(response.room as IRoom)
      }

      //update the last message of the room (on the sender side)
      updateLastMessage(response)

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
