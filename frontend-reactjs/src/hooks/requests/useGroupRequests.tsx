import { useState } from 'react'
import { useChatContext } from '../context/useChatContext'
import {
  createGroupService,
  leaveGroupService,
  updateGroupService,
} from '../../services/room.service'
import { useSocketContext } from '../context/useSocketContext'
import toast from 'react-hot-toast'
import { handleError } from '../../utils/error.util'

const useGroupRequests = () => {
  const [loading, setLoading] = useState(false)
  const { setRooms, setSelectedRoom } = useChatContext()
  const { socket } = useSocketContext()

  const createGroup = async (name: string, users: string[]) => {
    setLoading(true)
    try {
      const response = await createGroupService(name, users)

      if ('error' in response) {
        throw new Error(response.error)
      }

      setRooms((prevRooms) => [response, ...prevRooms])
      setSelectedRoom(response)
      socket?.emit('joinRoom', response._id)
      toast.success('Group created successfully')
    } catch (error: unknown) {
      handleError(error, 'Error in useGroupRequests ~ createGroup')
    } finally {
      setLoading(false)
    }
  }

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
      toast.success('Group updated successfully')
    } catch (error: unknown) {
      handleError(error, 'Error in useGroupRequests ~ updateGroup')
    } finally {
      setLoading(false)
    }
  }

  const leaveGroup = async (roomId: string) => {
    setLoading(true)
    try {
      const response = await leaveGroupService(roomId)

      if ('error' in response) {
        throw new Error(response.error)
      }

      setRooms((prev) => prev.filter((room) => room._id !== roomId))
      setSelectedRoom(null)
      socket?.emit('updateRoom', response)
      toast.success('Group left successfully')
    } catch (error: unknown) {
      handleError(error, 'Error in useGroupRequests ~ leaveGroup')
    } finally {
      setLoading(false)
    }
  }
  return { loading, createGroup, updateGroup, leaveGroup }
}

export default useGroupRequests
