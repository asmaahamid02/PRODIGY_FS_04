import { useEffect, useState } from 'react'
import { IRoom } from '../types/chat.type'
import { handleError } from '../utils/error.util'
import { getRoomsService } from '../services/room.service'

const useGetRooms = () => {
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<IRoom[]>([])

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
  }, [])

  return { loading, rooms }
}

export default useGetRooms
