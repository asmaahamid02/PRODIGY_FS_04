import { IMessage } from '../types/chat.type'

export const isSameSender = (
  messages: IMessage[],
  index: number,
  authUserId: string
) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== messages[index].sender._id ||
      !messages[index + 1].sender._id) &&
    messages[index].sender._id !== authUserId
  )
}

export const isLastMessage = (
  messages: IMessage[],
  index: number,
  authUserId: string
) => {
  return (
    index === messages.length - 1 && messages[index].sender._id !== authUserId
  )
}
