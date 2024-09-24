import { useCallback, useEffect } from 'react'
import { useSocketContext } from '../context/useSocketContext'
import { useChatContext } from '../context/useChatContext'
import { IMessage, IRoom } from '../../types/chat.type'
import notificationSound from '../../assets/audio/notification.mp3'
import { useAuthContext } from '../context/useAuthContext'

const useMessageListener = () => {
  const { socket } = useSocketContext()
  const { selectedRoom, setMessages, updateLastMessage, rooms, setRooms } =
    useChatContext()
  const { authUser } = useAuthContext()

  const addNewRoom = useCallback(
    (room: IRoom, senderId: string) => {
      const isSenderAuthUser = senderId === authUser?._id
      if (!isSenderAuthUser) {
        const isRoomAdded = rooms.some((r) => r._id === room._id)
        if (!isRoomAdded) {
          setRooms((prevRooms) => [room, ...prevRooms])
        }
      }
    },
    [authUser, rooms, setRooms]
  )

  useEffect(() => {
    socket?.on('messageReceived', async (newMessage: IMessage) => {
      const messageRoom = newMessage.room as IRoom

      //check if the room is added to the rooms array
      addNewRoom(messageRoom, newMessage.sender._id)

      //if the message is not for the selected room, play notification sound
      if (!selectedRoom || selectedRoom._id !== messageRoom?._id) {
        const sound = new Audio(notificationSound)
        try {
          sound.play()
        } catch (error) {
          console.log('error playing sound', error)
        }
      } else {
        //add the received message to the messages array
        setMessages((prevMessages) => [...prevMessages, newMessage])
      }

      //update the last message of the room
      updateLastMessage(newMessage, true)
    })

    return () => {
      socket?.off('messageReceived')
    }
  }, [selectedRoom, socket, setMessages, updateLastMessage, addNewRoom])

  //listen for last message read
  useEffect(() => {
    socket?.on('lastMessageRead', (room: IRoom) => {
      updateLastMessage(room.lastMessage as IMessage, false)
    })

    return () => {
      socket?.off('lastMessageRead')
    }
  }, [socket, updateLastMessage])
}

export default useMessageListener
