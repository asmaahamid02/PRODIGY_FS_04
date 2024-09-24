import Message from '../models/message.model'
import Room from '../models/room.model'
import { io } from '../config/socket.config'
import { getErrorMessage } from '../utils/error.util'

export const getTotalUnreadMessages = async (userId: string) => {
  try {
    const rooms = await Room.find({ participants: userId }).select('_id')

    if (!rooms) {
      return 0
    }

    const unreadMessages = await Message.countDocuments({
      room: { $in: rooms },
      'readBy.reader': { $ne: userId },
      sender: { $ne: userId },
    })

    return unreadMessages
  } catch (error) {
    console.log(
      getErrorMessage(
        error,
        'Error in Message Controller - getTotalUnreadMessages service'
      )
    )
    return 0
  }
}

// Mark messages as read for the room
export const markRoomsMessagesAsRead = async (
  roomId: string,
  currentUserId: string
) => {
  await Message.updateMany(
    {
      room: roomId,
      sender: { $ne: currentUserId },
      'readBy.reader': { $ne: currentUserId },
    },
    {
      $addToSet: {
        readBy: {
          reader: currentUserId,
          readAt: new Date(),
        },
      },
    }
  )
}

// Fetch room messages with sender information
export const fetchRoomMessages = async (roomId: string) => {
  return Message.find({
    room: roomId,
  })
    .populate('sender', '-password')
    .sort({ createdAt: 1 })
}

// Function to handle socket logic for updating message read status
export const updateMessageReadStatus = async (
  roomId: string,
  senderId: string,
  message: any
) => {
  const socketIdsJoinedRoom = io.sockets.adapter.rooms.get(roomId)

  if (socketIdsJoinedRoom) {
    socketIdsJoinedRoom.forEach((socketId) => {
      const userId = io.sockets.sockets.get(socketId)?.handshake.query.userId
      if (userId !== senderId) {
        message.readBy.push({ reader: userId, readAt: new Date() })
      }
    })
  }
}

// Function to populate message fields for the response
export const populateMessageForResponse = async (message: any) => {
  return message.populate([
    { path: 'sender', select: '-password' },
    {
      path: 'room',
      populate: [
        { path: 'participants', select: '-password' },
        {
          path: 'lastMessage',
          populate: { path: 'sender', select: '-password' },
        },
      ],
    },
  ])
}

export const getUnreadMessages = async (userId: string) => {
  try {
    const rooms = await Room.find({ participants: userId }).select('_id')

    if (!rooms) {
      return []
    }

    const unreadMessages = await Message.find({
      room: { $in: rooms },
      'readBy.reader': { $ne: userId },
      sender: { $ne: userId },
    })

    return unreadMessages
  } catch (error) {
    console.log(
      getErrorMessage(
        error,
        'Error in Message Controller - getUnreadMessages service'
      )
    )
    return 0
  }
}
