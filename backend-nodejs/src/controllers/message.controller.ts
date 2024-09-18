import { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.util'
import Room from '../models/room.model'
import Message from '../models/message.model'
import { IMessageBody } from '../types/message.type'
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

    const { groupId, receiverId, message }: IMessageBody = req.body
    const senderId = req.user?._id

    let room
    let isGroupMessage = false

    if (groupId) {
      room = await Room.findOne({
        _id: groupId,
        isGroup: true,
      })

      isGroupMessage = true
    } else if (senderId && receiverId) {
      room = await Room.findOne({
        participants: { $all: [senderId, receiverId] },
        isGroup: false,
      })

      // If room not found, create a new room
      if (!room) {
        room = await Room.create({
          participants: [senderId, receiverId],
        })
      }
    } else {
      return res
        .status(400)
        .json({ error: 'You must provide either groupId or receiverId' })
    }

    if (!room) {
      return res.status(404).json({ error: 'Room not found!' })
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      message,
      ...(isGroupMessage ? { groupId } : { receiverId }),
    })

    if (newMessage) {
      room.messages.push(newMessage._id)

      //TODO: Socket.io implementation

      await Promise.all([newMessage.save(), room.save()])
    }

    return res.status(201).json(newMessage)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Message Controller - SendMessage API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const currentUserId = req.user?._id

    const room = await Room.findOne({
      _id: roomId,
      participants: currentUserId,
    }).populate('messages')

    if (!room) {
      return res.status(200).json([])
    }

    return res.status(200).json(room.messages)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in Message Controller - GetMessages API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
