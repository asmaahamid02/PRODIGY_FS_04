import { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.util'
import User from '../models/user.model'
import Message from '../models/message.model'
import { notifyReceiver } from '../services/socket.service'
import {
  findOrCreateRoomByParticipants,
  findParticipantRooms,
  findRoomById,
} from '../services/room.service'
import {
  markRoomsMessagesAsRead,
  fetchRoomMessages,
} from '../services/message.service'
export const getRooms = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id

    const rooms = await findParticipantRooms(userId?.toString() || '')

    const unreadMessagesCountMap = new Map<string, number>()

    await Promise.all(
      rooms.map(async (room) => {
        const count = await Message.countDocuments({
          room: room._id,
          sender: { $ne: userId },
          'readBy.reader': { $ne: userId },
        })

        unreadMessagesCountMap.set(room.id, count)
      })
    )

    const roomsWithUnreadCount = rooms.map((room) => {
      return {
        ...room.toObject(),
        unreadCount: unreadMessagesCountMap.get(room.id),
      }
    })

    return res.status(200).json(roomsWithUnreadCount)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Room Controller - getRooms API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}

export const getRoomMessages = async (req: Request, res: Response) => {
  try {
    const { id: roomId } = req.params
    const currentUserId = req.user?._id

    if (!roomId) {
      return res.status(400).json({ error: 'RoomId is required!' })
    }

    let room = await findRoomById(roomId)
    if (!room) {
      return res.status(404).json({ error: 'Room not found!' })
    }

    //mark messages as read
    await markRoomsMessagesAsRead(roomId, currentUserId?.toString() as string)

    const messages = await fetchRoomMessages(roomId)

    if (!messages || messages.length === 0) {
      return res.status(200).json([])
    }

    // If last message is from another user, notify the receiver
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastMessageSenderId = (room.lastMessage as any)?.sender?._id
    if (
      lastMessageSenderId &&
      currentUserId &&
      lastMessageSenderId !== currentUserId
    ) {
      //get the newly updated room
      room = await findRoomById(roomId)
      notifyReceiver(currentUserId.toString(), 'lastMessageRead', room)
    }

    return res.status(200).json(messages)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Room Controller - getRoomMessages API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}

export const getRoom = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.params
    const currentUserId = req.user?._id

    if (!receiverId) {
      return res.status(400).json({ error: 'receiverId is required!' })
    }

    const receiver = await User.findById(receiverId)

    if (!receiver) {
      return res.status(404).json({ error: 'User not found!' })
    }

    const { room, isNew } = await findOrCreateRoomByParticipants([
      currentUserId ? currentUserId.toString() : '',
      receiverId,
    ])

    return res.status(200).json({ room, isNew })
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Room Controller - getRoom API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
