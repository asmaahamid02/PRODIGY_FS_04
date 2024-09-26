import { IRoom } from '../types/chat.type'
import { useChatContext } from './context/useChatContext'
import { useAuthContext } from './context/useAuthContext'
import { formatDate } from '../utils/date.util'
import { useSocketContext } from './context/useSocketContext'

interface IRoomInfoProps {
  room: IRoom
}

const useRoomInfo = ({ room }: IRoomInfoProps) => {
  const { selectedRoom } = useChatContext()
  const { authUser } = useAuthContext()
  const { onlineUsers, typing, typingInfo } = useSocketContext()

  const isGroup = room?.isGroup
  const sender = isGroup
    ? null
    : room?.participants.find((user) => user._id !== authUser?._id)

  //chat name
  const chatName = isGroup ? room.groupName : sender?.fullName
  const formattedChatName = chatName?.split(' ').join('+')

  //last message
  const lastMessage = room?.lastMessage
  const lastMessageText = lastMessage?.message
    ? lastMessage.message
    : 'No messages yet'
  const lastMessageTime = formatDate(lastMessage?.createdAt as string)
  const isLastMessageSentByMe = lastMessage?.sender?._id === authUser?._id

  //check if last message is read by the user
  const isLastMessageRead =
    !lastMessage ||
    lastMessage?.sender._id === authUser?._id ||
    selectedRoom?._id === room?._id
      ? true
      : lastMessage?.readBy?.some((item) => item.reader === authUser?._id)

  const profilePicture = isGroup
    ? `https://avatar.iran.liara.run/username?username=${formattedChatName}`
    : sender?.profilePicture

  const isSelected = selectedRoom?._id === room?._id

  //check if user is online
  const isOnline = onlineUsers.includes(sender?._id as string)

  //get typing user
  const typingUser = isGroup
    ? room.participants.find((user) => user._id === typingInfo?.userId)
    : null

  return {
    sender,
    chatName,
    isGroup,
    lastMessage,
    lastMessageText,
    lastMessageTime,
    profilePicture,
    isSelected,
    isOnline,
    typing: typing && typingInfo?.roomId === room._id,
    typingUser,
    isLastMessageRead,
    isLastMessageSentByMe,
  }
}

export default useRoomInfo
