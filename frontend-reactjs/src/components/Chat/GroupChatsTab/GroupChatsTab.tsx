import { ChangeEvent, FC, useEffect, useState } from 'react'
import useSearchUsers from '../../../hooks/requests/useSearchUsers'
import SearchInput from '../../inputs/SearchInput'
import Spinner from '../../utils/Spinner'
import UserItem from '../UserItem'
import { IoMdClose } from 'react-icons/io'
import { IUser } from '../../../types/user.type'
import toast from 'react-hot-toast'
import useGroupRequests from '../../../hooks/requests/useGroupRequests'
import { useModalContext } from '../../../hooks/context/useModalContext'
import { useChatContext } from '../../../hooks/context/useChatContext'
import { useAuthContext } from '../../../hooks/context/useAuthContext'

type IProps = {
  isEdit?: boolean
}
const GroupChatTab: FC<IProps> = ({ isEdit }) => {
  const { users, loading, searchUsers } = useSearchUsers()
  const { selectedRoom } = useChatContext()
  const { authUser } = useAuthContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
  const [groupName, setGroupName] = useState('')
  const { loading: loadingGroup, createGroup, updateGroup } = useGroupRequests()
  const { closeModal } = useModalContext()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    searchUsers(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const onClick = (user: IUser) => {
    const isExisted = selectedUsers.some((u) => u._id === user._id)

    if (!isExisted) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user])
    } else {
      toast.error(`${user.fullName} is added before!`)
    }

    clearSearch()
  }

  const removeUser = (id: string) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((u) => u._id !== id)
    )
  }

  const handleCreateUpdateGroup = async () => {
    if (loadingGroup) return

    if (groupName.trim() === '' || groupName.trim().length < 3) {
      toast.error('Group name must be at least 3 characters')
      return
    }

    if (selectedUsers.length < 2) {
      toast.error('Group must have at least 2 users')
      return
    }

    if (isEdit && isEdit === true) {
      const roomParticipantsIds =
        selectedRoom?.participants
          ?.filter((p) => p._id !== authUser?._id)
          .map((p) => p._id) ?? []
      const selectedParticipantsIds = selectedUsers.map((u) => u._id)

      if (
        groupName === selectedRoom?.groupName &&
        roomParticipantsIds.length === selectedParticipantsIds.length &&
        roomParticipantsIds.every((p) => selectedParticipantsIds.includes(p))
      ) {
        toast.error('No changes detected')
        return
      }

      await updateGroup(
        selectedRoom?._id ?? '',
        groupName,
        selectedUsers.map((user) => user._id)
      )
      clearSearch()
      closeModal()
    } else {
      await createGroup(
        groupName,
        selectedUsers.map((user) => user._id)
      )
      setSelectedUsers([])
      setGroupName('')
      clearSearch()
      closeModal()
    }
  }

  useEffect(() => {
    if (isEdit && isEdit === true) {
      setSelectedUsers(
        selectedRoom?.participants?.filter((p) => p._id !== authUser?._id) ?? []
      )
    }
  }, [authUser, selectedRoom, isEdit])

  useEffect(() => {
    if (isEdit && isEdit === true) {
      setGroupName(selectedRoom?.groupName ?? '')
    }
  }, [authUser, selectedRoom, isEdit])

  return (
    <div className='space-y-4'>
      {selectedUsers.length > 0 && (
        <div className='flex items-center flex-wrap gap-2'>
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className='badge badge-secondary badge-md gap-2'
            >
              {user.fullName}
              <button onClick={() => removeUser(user._id)}>
                <span className='sr-only'>Close button</span>
                <IoMdClose />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type='text'
        placeholder='Group name'
        className='input input-bordered w-full rounded-full'
        value={groupName}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setGroupName(e.target.value)
        }
      />

      <SearchInput
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
      />

      {searchQuery && (
        <div className='mt-4 space-y-4 overflow-y-auto'>
          {loading ? (
            <Spinner />
          ) : (
            <>
              {users.length > 0 ? (
                <>
                  {users.map((user) => (
                    <UserItem key={user._id} user={user} onClick={onClick} />
                  ))}
                </>
              ) : (
                <p className='text-center'>No users found</p>
              )}
            </>
          )}
        </div>
      )}

      <div className='flex justify-end'>
        <button
          className='btn btn-accent'
          disabled={loadingGroup}
          onClick={handleCreateUpdateGroup}
        >
          {isEdit === true ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  )
}

export default GroupChatTab
