import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { IMessage, IRoom } from '../types/chat.type'

type TChatContext = {
  selectedRoom: IRoom | null
  setSelectedRoom: Dispatch<SetStateAction<IRoom | null>>
  messages: IMessage[]
  setMessages: Dispatch<SetStateAction<IMessage[]>>
  rooms: IRoom[]
  setRooms: Dispatch<SetStateAction<IRoom[]>>
}

const initialState: TChatContext = {
  selectedRoom: null,
  setSelectedRoom: () => {},
  messages: [],
  setMessages: () => {},
  rooms: [],
  setRooms: () => {},
}

export const ChatContext = createContext<TChatContext>(initialState)

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [rooms, setRooms] = useState<IRoom[]>([])

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

  return (
    <ChatContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom,
        messages,
        setMessages,
        rooms,
        setRooms,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContextProvider
