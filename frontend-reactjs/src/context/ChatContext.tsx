import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'
import { IMessage, IRoom } from '../types/chat.type'

type TChatContext = {
  selectedRoom: IRoom | null
  setSelectedRoom: Dispatch<SetStateAction<IRoom | null>>
  messages: IMessage[]
  setMessages: Dispatch<SetStateAction<IMessage[]>>
}

const initialState: TChatContext = {
  selectedRoom: null,
  setSelectedRoom: () => {},
  messages: [],
  setMessages: () => {},
}

export const ChatContext = createContext<TChatContext>(initialState)

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])

  return (
    <ChatContext.Provider
      value={{ selectedRoom, setSelectedRoom, messages, setMessages }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContextProvider
