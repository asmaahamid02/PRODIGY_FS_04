import React, { useState } from 'react'
import { FaArrowLeft, FaEye } from 'react-icons/fa'
import ScrollableFeed from 'react-scrollable-feed'
import './index.css'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'

const ChatBox = () => {
  const [selectedChat, setSelectedChat] = useState(false)

  return (
    <div
      className={`${
        selectedChat ? 'flex' : 'hidden'
      } md:flex flex-col items-center bg-base-100 w-full rounded-lg`}
    >
      {selectedChat ? (
        <>
          {/* CHAT HEADER */}
          <div className='flex shrink-0 px-3 py-2 items-center justify-between w-full border-b-base-300 border-b'>
            {/* BACK BUTTON */}
            {selectedChat && (
              <button className='btn btn-ghost me-2 md:hidden'>
                <FaArrowLeft />
              </button>
            )}

            <h2 className='flex-1 text-lg md:text-xl font-bold'>Chat Name</h2>

            <button className='btn btn-ghost'>
              <FaEye />
            </button>
          </div>

          {/* CHAT BODY */}
          <div className='flex-1 flex flex-col justify-end overflow-y-auto w-full p-4'>
            <ScrollableFeed forceScroll={true}>
              <div className='chat chat-start'>
                <div
                  className='tooltip tooltip-bottom tooltip-info'
                  data-tip='Chat Name'
                >
                  <div className='chat-image avatar'>
                    <div className='w-10 rounded-full'>
                      <img
                        alt='Tailwind CSS chat bubble component'
                        src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                      />
                    </div>
                  </div>
                </div>
                <div className='chat-bubble'>You were the Chosen One!</div>
                <div className='chat-footer opacity-50'>15:20</div>
              </div>
              <div className='chat chat-end'>
                <div className='chat-bubble'>You were the Chosen One!</div>
                <div className='chat-footer opacity-50'>14:30</div>
              </div>
            </ScrollableFeed>
          </div>

          {/* CHAT INPUT */}
          <div className='flex shrink-0 px-3 py-2 items-center justify-between w-full border-t-base-300 border-t'>
            chat input
          </div>
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
