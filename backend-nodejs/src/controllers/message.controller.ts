import { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.util'
import Room from '../models/room.model'
import Message from '../models/message.model'
import { validateRequiredFields } from '../utils/validation.util'
import { getReceiverSocketId, io } from '../socket'
import { notifyReceiver } from '../services/socket.service'
import { createMessage } from '../services/message.service'
import { findOrCreateRoom } from '../services/room.service'

export const sendMessage2 = async (req: Request, res: Response) => {
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
    const receiverId = req.params.receiverId
    const senderId = req.user?._id

    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver Id is required!' })
    }

    let isNewRoom = false

    let room = await Room.findOne({
      participants: { $all: [senderId, receiverId] },
    })

    // If room not found, create a new room
    if (!room) {
      room = await Room.create({
        participants: [senderId, receiverId],
      })

      isNewRoom = true
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

    room.lastMessage = newMessage._id
    room.updatedAt = new Date()
    await room.save()

    //populate the sender
    newMessage = await newMessage.populate('sender', '-password')
    newMessage = await newMessage.populate('room')
    newMessage = await newMessage.populate('room.participants', '-password')
    newMessage = await newMessage.populate('room.lastMessage')
    newMessage = await newMessage.populate(
      'room.lastMessage.sender',
      '-password'
    )

    //TODO: Socket.io implementation
    //send created room to the receiver
    const receiverSocketId = getReceiverSocketId(receiverId)

    if (
      receiverSocketId &&
      io.sockets.sockets.has(receiverSocketId) &&
      isNewRoom
    ) {
      room = await room.populate('participants', '-password')
      room = await room.populate('lastMessage')
      room = await room.populate('lastMessage.sender', '-password')

      io.to(receiverSocketId).emit('roomCreated', room)
    }

    return res.status(201).json(newMessage)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Message Controller - SendMessage API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}

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
    const receiverId = req.params.receiverId
    const senderId = req.user?._id

    if (!receiverId || !senderId) {
      return res.status(400).json({ error: 'Participant Id is required!' })
    }

    // Find or create room
    const room = await findOrCreateRoom(senderId.toString(), receiverId)
    if (!room) {
      return res.status(404).json({ error: 'Room not found or created!' })
    }

    // Create and send message
    const newMessage = await createMessage(
      senderId.toString(),
      message,
      room._id.toString()
    )
    if (!newMessage) {
      return res.status(500).json({ error: 'Failed to send message!' })
    }

    // Update room's last message
    room.lastMessage = newMessage._id
    room.updatedAt = new Date()
    await room.save()

    // Populate necessary fields for the response
    await newMessage.populate([
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

    // Notify receiver about new room or message
    const isNewRoom = !room.lastMessage
    if (isNewRoom) {
      notifyReceiver(receiverId, 'roomCreated', room)
    }

    room.participants.forEach((participant) => {
      if (participant._id.toString() === senderId.toString()) {
        return
      }

      notifyReceiver(participant._id.toString(), 'messageReceived', newMessage)
    })

    return res.status(201).json(newMessage)
  } catch (error) {
    console.log(
      getErrorMessage(error, 'Error in Message Controller - SendMessage API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
