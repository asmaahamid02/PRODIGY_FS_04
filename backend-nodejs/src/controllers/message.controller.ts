import { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.util'
import { validateRequiredFields } from '../utils/validation.util'
import {
  populateMessageForResponse,
  updateMessageReaders,
  updateRoomLastMessage,
} from '../services/message.service'
import { findRoomByParticipants } from '../services/room.service'
import Message from '../models/message.model'
import {
  notifyRoomParticipants,
  notifyUsersOutsideRoom,
} from '../services/notification.service'

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
    await updateMessageReaders(
      room._id.toString(),
      senderId.toString(),
      newMessage
    )

    // Update room's last message
    await updateRoomLastMessage(room, newMessage)

    // Populate necessary fields for the response
    await populateMessageForResponse(newMessage)

    // Send message to the room participants
    await notifyRoomParticipants(room, senderId.toString(), newMessage)

    //send notifications to the users who are not in the room
    await notifyUsersOutsideRoom(room)

    return res.status(201).json(newMessage)
  } catch (error) {
    console.log(
      getErrorMessage(error, 'Error in Message Controller - SendMessage API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
