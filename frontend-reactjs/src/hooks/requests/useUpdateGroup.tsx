import { useState } from 'react'
import { useChatContext } from '../context/useChatContext'
import { updateGroupService } from '../../services/room.service'
import { useSocketContext } from '../context/useSocketContext'

const useCreateGroup = () => {
  const [loading, setLoading] = useState(false)
  const { setRooms, setSelectedRoom } = useChatContext()
  const { socket } = useSocketContext()

  const updateGroup = async (roomId: string, name: string, users: string[]) => {
    setLoading(true)
    try {
      const response = await updateGroupService(roomId, name, users)

      if ('error' in response) {
        throw new Error(response.error)
      }

      setRooms((prev) => {
        const updatedRooms = prev.map((room) => {
          if (room._id === roomId) {
            return response
          }
          return room
        })
        return updatedRooms
      })
      setSelectedRoom(response)
      socket?.emit('updateRoom', response)
    } catch (error: unknown) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return { loading, updateGroup }
}

export default useCreateGroup
