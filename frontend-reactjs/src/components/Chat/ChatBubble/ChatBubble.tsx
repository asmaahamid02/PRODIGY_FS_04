import { FC } from 'react'
import { IMessage } from '../../../types/chat.type'
import moment from 'moment'
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
    <div className={`chat ${message.isMe ? 'chat-end' : 'chat-start'}`}>
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
      <div
        className={`chat-bubble bg-gray-200 dark:bg-gray-700 text-base-content
        ${
          !message.isMe && !message.isSameSender && !message.isLastMessage
            ? 'ml-10'
            : ''
        }
        `}
      >
        {message.message}
      </div>

      {/* TIME */}
      <div className='chat-footer opacity-50'>
        {moment(message.createdAt).calendar()}
      </div>
    </div>
  )
}

export default ChatBubble
