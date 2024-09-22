import { useEffect, useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import RoomItem from '../RoomItem'
import NewChatModal from '../../modals/NewChatModal'
import useGetRooms from '../../../hooks/useGetRooms'
import { useChatContext } from '../../../hooks/useChatContext'
import SearchInput from '../../inputs/SearchInput'
import { useModalContext } from '../../../hooks/useModalContext'

const MyRooms = () => {
  const { selectedRoom, rooms } = useChatContext()
  const { modalRef, openModal } = useModalContext()
  const { loading } = useGetRooms()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRooms = useMemo(() => {
    if (!searchQuery) return rooms

    const lowerCaseQuery = searchQuery.toLowerCase()

    return rooms.filter((room) => {
      if (room.isGroup) {
        return room.groupName?.toLowerCase().includes(lowerCaseQuery)
      }

      return room.participants.some(
        (participant) =>
          participant.username.toLowerCase().includes(lowerCaseQuery) ||
          participant.fullName.toLowerCase().includes(lowerCaseQuery)
      )
    })
  }, [rooms, searchQuery])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  useEffect(() => {
    clearSearch()
  }, [selectedRoom])

  return (
    <>
      <div
        className={`${
          selectedRoom ? 'hidden' : 'flex'
        } md:flex flex-col shrink-0 items-center p-3 bg-base-100 w-full md:w-1/3 md:max-w-96 rounded-lg`}
      >
        {/* HEADER */}
        <div className='shrink-0 space-y-4 w-full'>
          <div className='flex items-center justify-between'>
            <h1 className='text-lg md:text-xl font-bold'>My Chats</h1>
            <button
              onClick={openModal}
              className='btn btn-circle btn-xs btn-primary'
            >
              <FaPlus />
            </button>
          </div>
          {/* SEARCH */}
          <SearchInput
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
          />
        </div>

        {/* CHAT LIST */}
        <div className='flex-1 overflow-y-auto w-full mt-3 space-y-2'>
          {loading ? (
            <div className='flex justify-center items-center h-16'>
              <span className='loading loading-ring loading-lg'></span>
            </div>
          ) : (
            <>
              {filteredRooms.length > 0 ? (
                <>
                  {filteredRooms.map((room) => (
                    <RoomItem key={room._id} room={room} />
                  ))}
                </>
              ) : (
                <p className='w-full text-center pt-2'>No chats yet!</p>
              )}
            </>
          )}
        </div>
      </div>

      <NewChatModal ref={modalRef} />
    </>
  )
}

export default MyRooms
