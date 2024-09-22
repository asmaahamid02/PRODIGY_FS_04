import { IRoom } from '../types/chat.type'
import { useChatContext } from './useChatContext'
import { useAuthContext } from './useAuthContext'
import {
  formateDate,
  formateDateToHoursAndMinutes,
  isToday,
  isYesterday,
} from '../utils/date.util'
import { useSocketContext } from './useSocketContext'

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
  const chatName = isGroup ? room.groupName : sender?.fullName
  const lastMessage = room?.lastMessage
  const lastMessageText = lastMessage?.message
    ? lastMessage.message
    : 'No messages yet'
  let lastMessageTime = lastMessage?.createdAt as string
  lastMessageTime = isYesterday(lastMessageTime)
    ? 'Yesterday'
    : isToday(lastMessageTime)
    ? formateDateToHoursAndMinutes(lastMessageTime)
    : formateDate(lastMessageTime)

  const formattedChatName = chatName?.split(' ').join('+')
  const profilePicture = isGroup
    ? `https://avatar.iran.liara.run/username?username=${formattedChatName}`
    : sender?.profilePicture
  const isSelected = selectedRoom?._id === room?._id

  //search among the participants of the room
  const isOnline = onlineUsers.includes(sender?._id as string)

  //get typing user
  const typingUser = isGroup
    ? room.participants.find((user) => user._id === typingInfo?.userId)
    : null

  return {
    sender,
    chatName,
    isGroup,
    lastMessageText,
    lastMessageTime,
    profilePicture,
    isSelected,
    isOnline,
    typing: typing && typingInfo?.roomId === room._id,
    typingUser,
  }
}

export default useRoomInfo
