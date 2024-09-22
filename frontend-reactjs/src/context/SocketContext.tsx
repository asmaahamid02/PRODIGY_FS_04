import { io, Socket } from 'socket.io-client'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

export type TSocketContextType = {
  socket: Socket | null
  onlineUsers: string[]
  typing?: boolean
  setTyping?: Dispatch<SetStateAction<boolean>>
  typingInfo?: { userId: string; roomId: string }
  setTypingInfo?: Dispatch<SetStateAction<{ userId: string; roomId: string }>>
  notifications?: any
  setNotifications?: any
}

const initialSocketContext: TSocketContextType = {
  socket: null,
  onlineUsers: [],
}

export const SocketContext =
  createContext<TSocketContextType>(initialSocketContext)

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [typing, setTyping] = useState<boolean>(false)
  const [typingInfo, setTypingInfo] = useState<{
    userId: string
    roomId: string
  }>()
  const [notifications, setNotifications] = useState<any>([])
  const { authUser } = useAuthContext()

  //connect socket and get online users
  useEffect(() => {
    if (authUser) {
      const newSocket = io(import.meta.env.VITE_SERVER_URL as string, {
        query: {
          userId: authUser._id,
        },
      })

      setSocket(newSocket)

      newSocket.on('connect', () => {
        console.log('Socket connected')
      })

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected')
      })

      newSocket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users)
      })

      return () => {
        newSocket.close()
      }
    } else {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser])

  //typing listeners
  useEffect(() => {
    socket?.on(
      'typingReceived',
      ({ userId, roomId }: { userId: string; roomId: string }) => {
        if (userId !== authUser?._id) {
          setTyping(true)
          setTypingInfo({ userId, roomId })
        }
      }
    )

    socket?.on('stopTypingReceived', (userId: string) => {
      if (userId !== authUser?._id) {
        setTyping(false)
        setTypingInfo(undefined)
      }
    })

    return () => {
      socket?.off('typingReceived')
      socket?.off('stopTypingReceived')
    }
  }, [socket, authUser])

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        typing,
        setTyping,
        typingInfo,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContextProvider
