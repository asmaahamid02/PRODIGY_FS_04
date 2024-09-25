import { useCallback, useEffect, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { IoSend } from 'react-icons/io5'
import useSendMessage from '../../../hooks/requests/useSendMessage'
import { useChatContext } from '../../../hooks/context/useChatContext'
import Spinner from '../../utils/Spinner'
import { useSocketContext } from '../../../hooks/context/useSocketContext'
import InputEmoji from 'react-input-emoji'
import { useThemeContext } from '../../../hooks/context/useThemeContext'

const SendMessage = () => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { selectedRoom, loadingMessages } = useChatContext()
  const { loading, sendMessage } = useSendMessage()
  const { socket } = useSocketContext()
  const { theme } = useThemeContext()

  const handleSendMessage = async () => {
    if (message.trim() === '' || loadingMessages) return

    await sendMessage(selectedRoom?._id as string, message)
    setMessage('')
  }

  const handleTyping = useCallback(
    (text: string) => {
      setMessage(text)

      if (!isTyping) {
        setIsTyping(true)

        socket?.emit('typing', selectedRoom)

        setTimeout(() => {
          socket?.emit('stopTyping', selectedRoom)
          setIsTyping(false)
        }, 3000)
      }
    },
    [isTyping, selectedRoom, socket]
  )

  useEffect(() => {
    if (selectedRoom) {
      setIsTyping(false)
      setMessage('')
    }
  }, [selectedRoom])

  return (
    <form className='flex gap-2 shrink-0 px-3 py-2 items-center justify-between w-full border-t-base-300 border-t'>
      <input type='file' className='hidden' id='file' />
      <label htmlFor='file' className='btn btn-sm btn-square btn-ghost'>
        <FiImage />
      </label>
      <InputEmoji
        value={message}
        onChange={handleTyping}
        cleanOnEnter
        placeholder='Type a message'
        shouldConvertEmojiToImage={false}
        shouldReturn={true}
        background='transparent'
        borderColor='transparent'
        theme={theme === 'light' ? 'light' : 'dark'}
        color={
          theme === 'light'
            ? 'oklch(0.278078 0.029596 256.848)'
            : 'oklch(0.746477 0.0216 264.436)'
        }
        onEnter={handleSendMessage}
      />
      {loading ? (
        <Spinner size='' />
      ) : (
        <button
          type='submit'
          disabled={loading || loadingMessages}
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
