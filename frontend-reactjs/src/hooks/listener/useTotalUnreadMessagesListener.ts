import { useEffect } from 'react'
import { useChatContext } from '../context/useChatContext'
import { useSocketContext } from '../context/useSocketContext'

const useTotalUnreadMessagesListener = () => {
  const { setTotalUnreadMessages } = useChatContext()
  const { socket } = useSocketContext()

  useEffect(() => {
    socket?.on('unreadMessagesCount', (count: number) => {
      if (count < 0) {
        return
      }

      if (setTotalUnreadMessages) {
        setTotalUnreadMessages(count)
      }
    })
  }, [socket, setTotalUnreadMessages])
}

export default useTotalUnreadMessagesListener
