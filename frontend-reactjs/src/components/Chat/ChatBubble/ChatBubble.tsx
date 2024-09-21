import { FC } from 'react'
import { IMessage } from '../../../types/chat.type'
import { formateDateTime } from '../../../utils/date.util'

interface IMessageProp extends IMessage {
  isMe: boolean
  isSameSender: boolean
  isLastMessage: boolean
}
interface IChatBubbleProps {
  message: IMessageProp
}

const ChatBubble: FC<IChatBubbleProps> = ({ message }) => {
  return (
    <div
      className={`chat ${message.isMe ? 'chat-end' : 'chat-start'} ${
        message.isSameSender ? 'pl-auto' : 'pl-10'
      }`}
    >
      {/* AVATAR */}
      {(message.isSameSender || message.isLastMessage) && (
        <div
          className='tooltip tooltip-bottom tooltip-info'
          data-tip={message.sender.fullName}
        >
          <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
              <img
                alt={message.sender.fullName}
                src={message.sender.profilePicture}
              />
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE */}
      <div className='chat-bubble'>{message.message}</div>

      {/* TIME */}
      <div className='chat-footer opacity-50'>
        {formateDateTime(message.createdAt)}
      </div>
    </div>
  )
}

export default ChatBubble
