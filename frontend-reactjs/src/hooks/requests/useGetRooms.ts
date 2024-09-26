import { useEffect, useState } from 'react'
import { handleError } from '../../utils/error.util'
import { getRoomsService } from '../../services/room.service'
import { useChatContext } from '../context/useChatContext'

const useGetRooms = () => {
  const [loading, setLoading] = useState(false)
  const { setRooms } = useChatContext()

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

  return { loading }
}

export default useGetRooms
