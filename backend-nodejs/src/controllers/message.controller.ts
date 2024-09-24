import { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.util'
import { validateRequiredFields } from '../utils/validation.util'
import { notifyReceiver } from '../services/socket.service'
import {
  getTotalUnreadMessages,
  populateMessageForResponse,
  updateMessageReadStatus,
} from '../services/message.service'
import {
  findOrCreateRoom,
  findRoomByParticipants,
} from '../services/room.service'
import Message from '../models/message.model'

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
    const room = await findRoomByParticipants([senderId.toString(), receiverId])
    if (!room) {
      return res.status(404).json({ error: 'Room not found' })
    }

    // Create and send message
    const newMessage = await Message.create({
      sender: senderId,
      message,
      room: room._id.toString(),
    })

    if (!newMessage) {
      return res.status(500).json({ error: 'Failed to send message!' })
    }

    // Update read status for the users in the room
    await updateMessageReadStatus(
      room._id.toString(),
      senderId.toString(),
      newMessage
    )

    // Update room's last message
    room.lastMessage = newMessage._id
    room.updatedAt = new Date()
    await Promise.all([room.save(), newMessage.save()])

    // Populate necessary fields for the response
    await populateMessageForResponse(newMessage)

    // Notify receiver about new room or message
    // if (isNewRoom) {
    //   room = await room.populate([
    //     { path: 'groupAdmin', select: '-password' },
    //     { path: 'participants', select: '-password' },
    //     {
    //       path: 'lastMessage',
    //       populate: { path: 'sender', select: '-password' },
    //     },
    //   ])

    //   notifyReceiver(receiverId, 'roomCreated', room)
    // }

    // room.participants.forEach((participant) => {
    //   if (participant._id.toString() === senderId.toString()) {
    //     return
    //   }

    //   notifyReceiver(participant._id.toString(), 'messageReceived', newMessage)
    // })

    //notify receiver about unread messages count
    // const totalUnreadMessages = await getTotalUnreadMessages(receiverId)
    // notifyReceiver(receiverId, 'unreadMessagesCount', totalUnreadMessages)

    return res.status(201).json(newMessage)
  } catch (error) {
    console.log(
      getErrorMessage(error, 'Error in Message Controller - SendMessage API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
