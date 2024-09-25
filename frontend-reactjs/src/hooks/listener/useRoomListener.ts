import { useEffect } from 'react'
import { useChatContext } from '../context/useChatContext'
import { useSocketContext } from '../context/useSocketContext'
import { useAuthContext } from '../context/useAuthContext'
import { IRoom } from '../../types/chat.type'

const useRoomListener = () => {
  const { setRooms, setSelectedRoom, selectedRoom, rooms } = useChatContext()
  const { socket } = useSocketContext()
  const { authUser } = useAuthContext()

  useEffect(() => {
    socket?.on('roomUpdated', (room: IRoom) => {
      //check if the user is a participant in the room
      const isParticipant = room.participants.some(
        (p) => p._id === authUser?._id
      )

      //if not participant, remove the room from the list
      if (!isParticipant) {
        if (selectedRoom?._id === room._id) {
          setSelectedRoom(null)
        }
        setRooms((prevRooms) => prevRooms.filter((r) => r._id !== room._id))
      } else {
        setRooms((prevRooms) => {
          const updatedRooms = prevRooms.map((r) => {
            if (r._id === room._id) {
              return room
            }
            return r
          })
          return updatedRooms
        })
      }
    })

    return () => {
      socket?.off('roomUpdated')
    }
  }, [setRooms, socket, selectedRoom, authUser, setSelectedRoom])

  useEffect(() => {
    socket?.on('newRoom', (room: IRoom) => {
      const isFound = rooms.some((r) => r._id === room._id)
      if (isFound) return
      setRooms((prevRooms) => [room, ...prevRooms])
    })

    return () => {
      socket?.off('newRoom')
    }
  }, [setRooms, socket, authUser, rooms])
}

export default useRoomListener
