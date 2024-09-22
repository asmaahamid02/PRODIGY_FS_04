import ScrollableFeed from 'react-scrollable-feed'
import { useChatContext } from '../../../hooks/useChatContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useMemo } from 'react'
import { isLastMessage, isSameSender } from '../../../utils/chat.util'
import ChatBubble from '../ChatBubble'

const ChatMessages = () => {
  const { messages } = useChatContext()
  const { authUser } = useAuthContext()
  const authUserId = authUser?._id as string

  const formattedMessages = useMemo(() => {
    if (messages.length === 0) return []

    return messages.map((message, index) => {
      const me = message.sender._id === authUserId
      const sameSender = isSameSender(messages, index, authUserId)
      const lastMessage = isLastMessage(messages, index, authUserId)

      return {
        ...message,
        isMe: me,
        isSameSender: sameSender,
        isLastMessage: lastMessage,
      }
    })
  }, [messages, authUserId])

  return (
    <>
      {formattedMessages.length > 0 ? (
        <div className='flex-1 overflow-y-auto flex justify-end w-full p-4'>
          <ScrollableFeed className='w-full' forceScroll={true}>
            {formattedMessages.map((message) => {
              return <ChatBubble message={message} key={message._id} />
            })}
          </ScrollableFeed>
        </div>
      ) : (
        <div className='flex-1 flex justify-center items-center'>
          <p className='text-lg'>No messages yet, start chatting</p>
        </div>
      )}
    </>
  )
}

export default ChatMessages
