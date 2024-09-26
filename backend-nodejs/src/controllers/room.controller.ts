import { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.util'
import User from '../models/user.model'
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
import { IGroupRequest } from '../types/room.type'
import { validateGroupRequest } from '../utils/validation.util'
import Room from '../models/room.model'
export const getRooms = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id

    const rooms = await findParticipantRooms(userId?.toString() || '')

    return res.status(200).json(rooms)
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

    if (isNew) {
      room.participants.forEach((participant) => {
        if (participant._id.toString() === currentUserId?.toString()) {
          return
        }

        notifyReceiver(participant._id.toString(), 'newRoom', room)
      })
    }

    return res.status(200).json({ room, isNew })
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Room Controller - getRoom API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, users }: IGroupRequest = req.body
    const userId = req.user?._id

    validateGroupRequest(req.body, ['name', 'users'])

    const foundUsers = await User.find({ _id: { $in: users } }).select('_id')

    if (!foundUsers.length) {
      return res.status(400).json({ error: 'No valid users found!' })
    }

    let room = await Room.create({
      groupName: name.trim(),
      participants: [userId, ...foundUsers],
      isGroup: true,
      groupAdmin: userId,
    })

    room = await room.populate([
      { path: 'participants', select: '-password' },
      { path: 'groupAdmin', select: '-password' },
      {
        path: 'lastMessage',
        populate: { path: 'sender', select: '-password' },
      },
    ])

    room.participants.forEach((participant) => {
      if (participant._id.toString() !== userId?.toString()) {
        notifyReceiver(participant._id.toString(), 'newRoom', room)
      }
    })

    return res.status(201).send(room)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Room Controller - createGroup API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { name, users }: IGroupRequest = req.body
    const userId = req.user?._id
    const roomId = req.params.roomId

    if (!roomId || !userId) {
      res.status(400).json({ error: 'roomId is required!' })
    }

    validateGroupRequest(req.body, ['name', 'users'])

    const foundUsers = await User.find({ _id: { $in: users } }).select('_id')
    if (!foundUsers.length) {
      return res.status(400).json({ error: 'No valid users found!' })
    }

    const room = await Room.findByIdAndUpdate(
      roomId,
      {
        $set: { participants: [userId, ...foundUsers], groupName: name.trim() },
      },
      { new: true }
    ).populate([
      { path: 'participants', select: '-password' },
      { path: 'groupAdmin', select: '-password' },
      {
        path: 'lastMessage',
        populate: { path: 'sender', select: '-password' },
      },
    ])

    if (!room) {
      return res.status(404).json({ error: 'Room not found!' })
    }

    room.participants.forEach((participant) => {
      if (participant._id.toString() !== userId?.toString()) {
        notifyReceiver(participant._id.toString(), 'newRoom', room)
      }
    })

    return res.status(201).send(room)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Room Controller - createGroup API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}

export const leaveGroup = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id
    const roomId = req.params.roomId

    if (!roomId || !userId) {
      res.status(400).json({ error: 'roomId is required!' })
    }

    const room = await Room.findById(roomId)
    if (!room) {
      return res.status(404).json({ error: 'Room not found!' })
    }

    //if the user is not a participant of the group
    if (userId && !room.participants.includes(userId)) {
      return res.status(400).json({ error: 'User is not a participant!' })
    }

    //if there is no participant left in the group, delete the room
    if (room.participants.length === 1) {
      await Room.findByIdAndDelete(roomId)
      return res.status(200).json({ deleted: true})
    }

    let roomAdmin = room.groupAdmin?.toString()
    //if the admin is leaving the group, make the first participant as admin
    if (room?.groupAdmin?.toString() === userId?.toString()) {
      const newAdmin = room.participants.find(
        (participant) => participant.toString() !== userId?.toString()
      )

      if (newAdmin) {
        roomAdmin = newAdmin.toString()
      }
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        $pull: { participants: userId },
        groupAdmin: roomAdmin,
      },
      { new: true }
    ).populate([
      { path: 'participants', select: '-password' },
      { path: 'groupAdmin', select: '-password' },
      {
        path: 'lastMessage',
        populate: { path: 'sender', select: '-password' },
      },
    ])

    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found!' })
    }

    return res.status(201).send(updatedRoom)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Room Controller - leaveGroup API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
