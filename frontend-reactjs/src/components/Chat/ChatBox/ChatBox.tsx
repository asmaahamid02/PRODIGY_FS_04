import './index.css'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { useChatContext } from '../../../hooks/useChatContext'
import useGetMessages from '../../../hooks/useGetMessages'
import Spinner from '../../utils/Spinner'
import ChatHeader from '../ChatHeader'
import ChatMessages from '../ChatMessages'
import SendMessage from '../SendMessage'

const ChatBox = () => {
  const { selectedRoom } = useChatContext()
  const { loading } = useGetMessages()

  return (
    <div
      className={`${
        selectedRoom ? 'flex' : 'hidden'
      } md:flex flex-col items-center bg-base-100 w-full rounded-lg`}
    >
      {selectedRoom ? (
        <>
          {/* CHAT HEADER */}
          <ChatHeader />

          {/* CHAT BODY */}
          {loading ? (
            <div className='flex-1 flex justify-center items-center'>
              <Spinner />
            </div>
          ) : (
            <ChatMessages />
          )}

          {/* CHAT INPUT */}
          <SendMessage />
        </>
      ) : (
        <div className='flex flex-col gap-2 justify-center items-center h-full'>
          <p className='text-xl md:text-3xl'>Welcome 👋 to Connectify</p>
          <p className=' text-lg md:text-xl'>
            Select a chat to start messaging
          </p>
          <IoChatbubbleEllipsesOutline className='text-4xl md:text-9xl' />
        </div>
      )}
    </div>
  )
}

export default ChatBox
