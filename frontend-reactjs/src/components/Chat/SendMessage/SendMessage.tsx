import { useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { IoSend } from 'react-icons/io5'
import useSendMessage from '../../../hooks/useSendMessage'
import useRoomInfo from '../../../hooks/useRoomInfo'
import { useChatContext } from '../../../hooks/useChatContext'
import { IRoom } from '../../../types/chat.type'
import Spinner from '../../utils/Spinner'

const SendMessage = () => {
  const [message, setMessage] = useState('')
  const { selectedRoom } = useChatContext()
  const { loading, sendMessage } = useSendMessage()
  const { sender } = useRoomInfo({ room: selectedRoom as IRoom })

  const handleSendMessage = async () => {
    if (message.trim() === '') return

    await sendMessage(sender?._id as string, message)
    setMessage('')
  }

  return (
    <form className='flex gap-2 shrink-0 px-3 py-2 items-center justify-between w-full border-t-base-300 border-t'>
      <input type='file' className='hidden' id='file' />
      <label htmlFor='file' className='btn btn-sm btn-square btn-ghost'>
        <FiImage />
      </label>
      <input
        type='text'
        placeholder='Type here'
        className='input input-ghost flex-1 focus:border-none focus:ring-0 focus:outline-none'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {loading ? (
        <Spinner size='' />
      ) : (
        <button
          type='submit'
          disabled={loading}
          className='btn btn-ghost btn-sm'
          onClick={handleSendMessage}
        >
          <IoSend />
        </button>
      )}
    </form>
  )
}

export default SendMessage
