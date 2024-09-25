import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { IMessage, IRoom } from '../types/chat.type'
import { useSocketContext } from '../hooks/context/useSocketContext'

type TChatContext = {
  selectedRoom: IRoom | null
  setSelectedRoom: Dispatch<SetStateAction<IRoom | null>>
  messages: IMessage[]
  setMessages: Dispatch<SetStateAction<IMessage[]>>
  rooms: IRoom[]
  setRooms: Dispatch<SetStateAction<IRoom[]>>
  updateLastMessage: (newMessage: IMessage, updateUnreadCount?: boolean) => void
  loadingMessages?: boolean
  setLoadingMessages?: Dispatch<SetStateAction<boolean>>
  notifications: IRoom[]
  setNotifications: Dispatch<SetStateAction<IRoom[]>>
}

const initialState: TChatContext = {
  selectedRoom: null,
  setSelectedRoom: () => {},
  messages: [],
  setMessages: () => {},
  rooms: [],
  setRooms: () => {},
  updateLastMessage: () => {},
  notifications: [],
  setNotifications: () => {},
}

export const ChatContext = createContext<TChatContext>(initialState)

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false)
  const [rooms, setRooms] = useState<IRoom[]>([])
  const [notifications, setNotifications] = useState<IRoom[]>([])
  const { socket } = useSocketContext()

  const updateLastMessage = useCallback(
    (newMessage: IMessage, updateUnreadCount: boolean = false) => {
      const timeout = setTimeout(() => {
        setRooms((prevRooms) => {
          const roomIndex = prevRooms.findIndex(
            (r) => r._id === (newMessage.room as IRoom)._id
          )

          if (roomIndex === -1) return prevRooms

          const updatedRooms = [...prevRooms]
          updatedRooms[roomIndex] = {
            ...updatedRooms[roomIndex],
            lastMessage: (newMessage.room as IRoom).lastMessage,
          }

          if (updateUnreadCount) {
            const messageRoom = newMessage.room as IRoom
            const isDifferentRoom = selectedRoom?._id !== messageRoom._id
            const unreadCount =
              (updatedRooms[roomIndex].unreadCount as number) || 0

            if (isDifferentRoom) {
              updatedRooms[roomIndex] = {
                ...updatedRooms[roomIndex],
                unreadCount: unreadCount + 1,
              }
            }
          }
          return updatedRooms
        })
      }, 500)

      return () => {
        clearTimeout(timeout)
      }
    },
    [selectedRoom]
  )

  useEffect(() => {
    if (selectedRoom) {
      socket?.emit('joinRoom', selectedRoom._id)
    }
  }, [selectedRoom, socket])

  return (
    <ChatContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom,
        messages,
        setMessages,
        rooms,
        setRooms,
        updateLastMessage,
        loadingMessages,
        setLoadingMessages,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContextProvider
