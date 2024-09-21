import { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.util'
import Room from '../models/room.model'
import Message from '../models/message.model'
import { validateRequiredFields } from '../utils/validation.util'

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const validateRequiredFieldsResponse = validateRequiredFields(req.body, [
      'message',
    ])

    if (!validateRequiredFieldsResponse.valid) {
      return res
        .status(400)
        .json({ error: validateRequiredFieldsResponse.message })
    }

    const { message }: { message: string } = req.body
    const senderId = req.user?._id

    const receiverId = req.params.receiverId
    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver Id is required!' })
    }

    let room = await Room.findOne({
      participants: { $all: [senderId, receiverId] },
    })

    // If room not found, create a new room
    if (!room) {
      room = await Room.create({
        participants: [senderId, receiverId],
      })
    }

    if (!room) {
      return res.status(404).json({ error: 'Room not found!' })
    }

    // Create a new message
    let newMessage = await Message.create({
      sender: senderId,
      message,
      room: room._id,
    })

    if (!newMessage) {
      return res.status(500).json({ error: 'Failed to send message!' })
    }

    //populate the sender
    newMessage = await newMessage.populate('sender', '-password')
    newMessage = await newMessage.populate('room')
    newMessage = await newMessage.populate('room.participants', '-password')

    room.lastMessage = newMessage._id
    room.updatedAt = new Date()
    await room.save()

    //TODO: Socket.io implementation

    return res.status(201).json(newMessage)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Message Controller - SendMessage API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
