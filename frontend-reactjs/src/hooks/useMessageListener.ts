import { useEffect } from 'react'
import { useSocketContext } from './useSocketContext'
import { useChatContext } from './useChatContext'
import { IMessage, IRoom } from '../types/chat.type'
import notificationSound from '../assets/audio/notification.mp3'

const useMessageListener = () => {
  const { socket } = useSocketContext()
  const { selectedRoom, setMessages, updateLastMessage } = useChatContext()

  useEffect(() => {
    socket?.on('messageReceived', async (newMessage: IMessage) => {
      const messageRoom = newMessage.room as IRoom
      if (!selectedRoom || selectedRoom._id !== messageRoom?._id) {
        //TODO play notification sound
        const sound = new Audio(notificationSound)

        try {
          sound.play()
        } catch (error) {
          console.log('error playing sound', error)
        }
      } else {
        //update messages
        setMessages((prevMessages) => [...prevMessages, newMessage])
      }
      //update the last message of the room
      updateLastMessage(newMessage, true)
    })

    return () => {
      socket?.off('messageReceived')
    }
  }, [selectedRoom, setMessages, socket, updateLastMessage])

  //listen for last message read
  useEffect(() => {
    socket?.on('lastMessageRead', (room: IRoom) => {
      updateLastMessage(room.lastMessage as IMessage)
    })

    return () => {
      socket?.off('lastMessageRead')
    }
  }, [socket, updateLastMessage])
}

export default useMessageListener
