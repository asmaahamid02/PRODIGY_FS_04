import { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.util'
import Room from '../models/room.model'
import User from '../models/user.model'
import Message from '../models/message.model'
export const getRooms = async (req: Request, res: Response) => {
  try {
    //eslint-disable-next-line
    let rooms: any = await Room.find({
      participants: req.user?._id,
    })
      .populate('participants', '-password')
      .populate('groupAdmin', '-password')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })

    //populate the last message sender
    rooms = await User.populate(rooms, {
      path: 'lastMessage.sender',
      select: '-password',
    })

    if (!rooms) {
      return res.status(200).json([])
    }

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

    const room = await Room.findOne({
      _id: roomId,
      participants: currentUserId,
    })

    if (!room) {
      return res.status(404).json({ error: 'Room not found!' })
    }

    const messages = await Message.find({
      room: roomId,
    })
      .populate('sender', '-password')
      .sort({ createdAt: 1 })

    if (!messages) {
      return res.status(200).json([])
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
      participants: receiverId,
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
