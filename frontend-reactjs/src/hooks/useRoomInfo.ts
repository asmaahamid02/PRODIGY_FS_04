import { IRoom } from '../types/chat.type'
import { useChatContext } from './useChatContext'
import { useAuthContext } from './useAuthContext'
import {
  formateDate,
  formateDateToHoursAndMinutes,
  isToday,
  isYesterday,
} from '../utils/date.util'

interface IRoomInfoProps {
  room: IRoom
}

const useRoomInfo = ({ room }: IRoomInfoProps) => {
  const { selectedRoom } = useChatContext()
  const { authUser } = useAuthContext()

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

  return {
    sender,
    chatName,
    lastMessageText,
    lastMessageTime,
    profilePicture,
    isSelected,
  }
}

export default useRoomInfo
