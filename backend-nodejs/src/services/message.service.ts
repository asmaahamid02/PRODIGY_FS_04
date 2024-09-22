import Message from '../models/message.model'

export const createMessage = async (
  senderId: string,
  message: string,
  roomId: string
) => {
  const newMessage = await Message.create({
    sender: senderId,
    message,
    room: roomId,
  })

  return newMessage
}
