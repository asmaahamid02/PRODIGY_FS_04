import { useCallback, useEffect } from 'react'
import { useSocketContext } from './useSocketContext'
import { useChatContext } from './useChatContext'
import { IMessage, IRoom } from '../types/chat.type'

const useMessageListener = () => {
  const { socket } = useSocketContext()
  const { rooms, setRooms, selectedRoom, setMessages } = useChatContext()

  const updateRoom = useCallback(
    (newMessage: IMessage) => {
      const messageRoom = newMessage.room as IRoom

      const roomIndex = rooms.findIndex((room) => room._id === messageRoom?._id)

      const updatedRoom = { ...rooms[roomIndex] }
      updatedRoom.lastMessage = newMessage

      setRooms((prevRooms) => {
        const updatedRooms = [...prevRooms]
        updatedRooms[roomIndex] = updatedRoom
        return updatedRooms
      })
    },
    [rooms, setRooms]
  )

  useEffect(() => {
    socket?.on('messageReceived', (newMessage: IMessage) => {
      const messageRoom = newMessage.room as IRoom
      console.log('messageRoom', messageRoom)
      if (!selectedRoom || selectedRoom._id !== messageRoom?._id) {
        //append message to unread messages
        //TODO: show unread messages
        //notify user
        //TODO: show notification
      } else {
        //update messages
        setMessages((prevMessages) => [...prevMessages, newMessage])
      }
      //update the last message of the room
      updateRoom(newMessage)
    })

    return () => {
      socket?.off('messageReceived')
    }
  }, [selectedRoom, setMessages, socket, updateRoom])
}

export default useMessageListener
