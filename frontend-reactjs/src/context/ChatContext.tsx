import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { IMessage, IRoom } from '../types/chat.type'
import { useSocketContext } from '../hooks/useSocketContext'

type TChatContext = {
  selectedRoom: IRoom | null
  setSelectedRoom: Dispatch<SetStateAction<IRoom | null>>
  messages: IMessage[]
  setMessages: Dispatch<SetStateAction<IMessage[]>>
  rooms: IRoom[]
  setRooms: Dispatch<SetStateAction<IRoom[]>>
  totalUnreadMessages?: number
  setTotalUnreadMessages?: Dispatch<SetStateAction<number>>
  updateLastMessage: (newMessage: IMessage, updateUnreadCount?: boolean) => void
}

const initialState: TChatContext = {
  selectedRoom: null,
  setSelectedRoom: () => {},
  messages: [],
  setMessages: () => {},
  rooms: [],
  setRooms: () => {},
  updateLastMessage: () => {},
}

export const ChatContext = createContext<TChatContext>(initialState)

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [rooms, setRooms] = useState<IRoom[]>([])
  const [totalUnreadMessages, setTotalUnreadMessages] = useState<number>(0)
  const { socket } = useSocketContext()

  const updateLastMessage = (
    newMessage: IMessage,
    updateUnreadCount: boolean = false
  ) => {
    const newRooms = [...rooms]
    const roomIndex = newRooms.findIndex(
      (r) => r._id === (newMessage.room as IRoom)._id
    )

    if (roomIndex === -1) return

    newRooms[roomIndex].lastMessage = (newMessage.room as IRoom).lastMessage

    if (updateUnreadCount) {
      const messageRoom = newMessage.room as IRoom
      const isDifferentRoom = selectedRoom?._id !== messageRoom._id
      const unreadCount = newRooms[roomIndex].unreadCount as number

      if (isDifferentRoom) {
        newRooms[roomIndex].unreadCount = unreadCount + 1
      }
    }

    setRooms(newRooms)

    // setRooms((prevRooms) => {
    //   console.log('updateLastMessage called with:', newMessage)

    //   const roomIndex = prevRooms.findIndex(
    //     (r) => r._id === (newMessage.room as IRoom)._id
    //   )

    //   if (roomIndex === -1) return prevRooms

    //   const updatedRooms = [...prevRooms]
    //   updatedRooms[roomIndex].lastMessage = (
    //     newMessage.room as IRoom
    //   ).lastMessage

    //   if (updateUnreadCount) {
    //     const messageRoom = newMessage.room as IRoom
    //     const isDifferentRoom = selectedRoom?._id !== messageRoom._id
    //     const unreadCount = updatedRooms[roomIndex].unreadCount as number
    //     // const isMoreThanTotalUnreadMessages = unreadCount > totalUnreadMessages

    //     if (isDifferentRoom) {
    //       console.log(
    //         'unreadCount updated',
    //         updatedRooms[roomIndex].unreadCount
    //       )
    //       updatedRooms[roomIndex].unreadCount = unreadCount + 1
    //     }
    //   }
    //   return updatedRooms
    // })
  }

  //remove fake rooms when the selectedRoom is changed
  useEffect(() => {
    if (selectedRoom) {
      //remove fake rooms without selectedRoom
      const newRooms = rooms.filter(
        (room) => !room.isFake || room._id === selectedRoom._id
      )

      if (newRooms.length !== rooms.length) setRooms(newRooms)
    }
  }, [selectedRoom, rooms])

  useEffect(() => {
    if (selectedRoom) {
      socket?.emit('joinRoom', selectedRoom._id)
    }
  }, [selectedRoom, socket])

  useEffect(() => {
    console.log('rooms', rooms)
  }, [rooms])

  return (
    <ChatContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom,
        messages,
        setMessages,
        rooms,
        setRooms,
        totalUnreadMessages,
        setTotalUnreadMessages,
        updateLastMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContextProvider
