import { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.util'
import Room from '../models/room.model'
import User from '../models/user.model'
import Message from '../models/message.model'
import { notifyReceiver } from '../services/socket.service'
import { findRoomById } from '../services/room.service'
import {
  markMessagesAsRead,
  fetchRoomMessages,
} from '../services/message.service'
export const getRooms = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id

    const rooms = await Room.find({
      participants: userId,
    })
      .populate([
        { path: 'participants', select: '-password' },
        { path: 'groupAdmin', select: '-password' },
        {
          path: 'lastMessage',
          populate: { path: 'sender', select: '-password' },
        },
      ])
      .sort({ updatedAt: -1 })

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
    await markMessagesAsRead(roomId, currentUserId?.toString() as string)

    const messages = await fetchRoomMessages(roomId)

    if (!messages || messages.length === 0) {
      return res.status(200).json([])
    }

    // If last message is from another user, notify the receiver
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
    const currentUser = req.user

    if (!receiverId) {
      return res.status(400).json({ error: 'receiverId is required!' })
    }

    const receiver = await User.findById(receiverId)

    if (!receiver) {
      return res.status(404).json({ error: 'User not found!' })
    }

    const fakeRoom = {
      _id: new Date().getTime().toString(),
      participants: [currentUser, receiver],
      lastMessage: null,
      isGroup: false,
      isFake: true,
    }

    //eslint-disable-next-line
    let room: any = await Room.findOne({
      participants: { $all: [currentUser?._id, receiverId] },
    })
      .populate('participants', '-password')
      .populate('groupAdmin', '-password')
      .populate('lastMessage')

    if (!room) {
      //return fake room
      return res.status(200).json(fakeRoom)
    }

    //populate the last message sender
    room = await User.populate(room, {
      path: 'lastMessage.sender',
      select: '-password',
    })

    return res.status(200).json(room)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Room Controller - getRoom API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
