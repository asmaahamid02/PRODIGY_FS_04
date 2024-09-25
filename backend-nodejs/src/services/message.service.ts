import Message from '../models/message.model'
import { io } from '../config/socket.config'
import { IRoom } from '../types/room.type'
import { IMessage } from '../types/message.type'
import { Document, Types } from 'mongoose'

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

// Function to handle message read by users
export const updateMessageReaders = async (
  roomId: string,
  senderId: string,
  message: IMessage & Document
) => {
  const socketIdsJoinedRoom = io.sockets.adapter.rooms.get(roomId)

  if (socketIdsJoinedRoom) {
    socketIdsJoinedRoom.forEach((socketId) => {
      const userId = io.sockets.sockets.get(socketId)?.handshake.query.userId
      if (userId !== senderId) {
        if (!message.readBy) {
          message.readBy = []
        }
        message.readBy.push({
          reader: new Types.ObjectId(userId as string),
          readAt: new Date(),
        })
      }
    })
  }
}

// Function to populate message fields for the response
export const populateMessageForResponse = async (
  message: IMessage & Document
) => {
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

export const updateRoomLastMessage = async (
  room: IRoom & Document,
  message: IMessage & Document
) => {
  room.lastMessage = message._id
  room.updatedAt = new Date()
  await Promise.all([room.save(), message.save()])
}
