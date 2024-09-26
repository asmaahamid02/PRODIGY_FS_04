import { useState } from 'react'
import { handleError } from '../../utils/error.util'
import { getRoomService } from '../../services/room.service'
import { useChatContext } from '../context/useChatContext'

const useGetRoom = () => {
  const [loading, setLoading] = useState(false)
  const { setRooms, setSelectedRoom } = useChatContext()

  const getRoom = async (receiverId: string) => {
    setLoading(true)
    try {
      const response = await getRoomService(receiverId)

      if ('error' in response) {
        throw new Error(response.error)
      }

      if (response.isNew) {
        //insert the new room at the beginning of the array
        setRooms((previousRooms) => [response.room, ...previousRooms])
      }

      setSelectedRoom(response.room)
    } catch (error) {
      handleError(error, 'Error in useGetRooms ~ getRooms')
    } finally {
      setLoading(false)
    }
  }

  return { loading, getRoom }
}

export default useGetRoom
