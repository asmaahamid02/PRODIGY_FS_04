import { useEffect } from 'react'
import { useChatContext } from '../context/useChatContext'
import { useSocketContext } from '../context/useSocketContext'
import { IRoom } from '../../types/chat.type'

const useNotificationListener = () => {
  const { setNotifications } = useChatContext()
  const { socket } = useSocketContext()
  const { selectedRoom } = useChatContext()

  useEffect(() => {
    socket?.on('getNotifications', (notifications: IRoom[]) => {
      setNotifications(notifications)
    })
  }, [socket, setNotifications])

  useEffect(() => {
    socket?.on('newNotifications', (notifications: IRoom[]) => {
      setNotifications(notifications)
    })
  }, [socket, setNotifications])

  useEffect(() => {
    if (selectedRoom) {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n._id !== selectedRoom._id)
      )
    }
  }, [selectedRoom, setNotifications])
}

export default useNotificationListener
