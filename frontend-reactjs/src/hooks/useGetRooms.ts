import { useSocketContext } from './useSocketContext'
import { useEffect, useState } from 'react'
import { IRoom } from '../types/chat.type'
import { handleError } from '../utils/error.util'
import { getRoomsService } from '../services/room.service'
import { useChatContext } from './useChatContext'
import { MdRoomPreferences } from 'react-icons/md'

const useGetRooms = () => {
  const [loading, setLoading] = useState(false)
  const { setRooms } = useChatContext()
  const { socket } = useSocketContext()

  useEffect(() => {
    const getRooms = async () => {
      setLoading(true)

      try {
        const response = await getRoomsService()

        setRooms(response)
      } catch (error) {
        handleError(error, 'Error in useGetRooms ~ getRooms')
      } finally {
        setLoading(false)
      }
    }

    getRooms()
  }, [setRooms])

  //roomCreated listener
  useEffect(() => {
    socket?.on('roomCreated', (room: IRoom) => {
      console.log('room', room)
      // const isExisted = rooms.find((r) => r._id === room._id)

      // if (!isExisted)
      setRooms((prevRooms) => [room, ...prevRooms])
    })

    return () => {
      socket?.off('roomCreated')
    }
  }, [socket, setRooms])

  return { loading }
}

export default useGetRooms
