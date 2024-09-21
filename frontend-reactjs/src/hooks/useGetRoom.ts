import { useState } from 'react'
import { handleError } from '../utils/error.util'
import { getRoomService } from '../services/room.service'
import { useChatContext } from './useChatContext'

const useGetRoom = () => {
  const [loading, setLoading] = useState(false)
  const { rooms, setRooms } = useChatContext()

  const getRoom = async (receiverId: string) => {
    setLoading(true)
    try {
      const response = await getRoomService(receiverId)

      if ('error' in response) {
        throw new Error(response.error)
      }

      let existedRoom = null
      let roomExists = false

      //if the room is fake, check the participants
      if (response.isFake) {
        existedRoom = rooms
          .filter((room) => room.isFake)
          .find((room) => {
            const isSameParticipants = room.participants.every((participant) =>
              response.participants.some((p) => p._id === participant._id)
            )
            return isSameParticipants
          })
        roomExists = existedRoom !== undefined
      } else {
        roomExists = rooms.some((room) => room._id === response._id)
      }

      if (!roomExists) {
        //insert the new room at the beginning of the array
        setRooms([response, ...rooms])

        return response
      }

      return existedRoom
    } catch (error) {
      handleError(error, 'Error in useGetRooms ~ getRooms')
    } finally {
      setLoading(false)
    }
  }

  return { loading, getRoom }
}

export default useGetRoom
