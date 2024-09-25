import React, { FC } from 'react'
import { IoMdClose } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'

interface ISearchInputProps {
  searchQuery: string
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearSearch: () => void
  placeholder?: string
}

const SearchInput: FC<ISearchInputProps> = ({
  searchQuery,
  handleSearch,
  clearSearch,
  placeholder = 'Search user..',
}) => {
  return (
    <label className='input input-bordered flex items-center gap-2 rounded-full'>
      <input
        type='text'
        className='grow'
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearch}
      />
      {searchQuery ? (
        <button
          className='tooltip tooltip-bottom'
          data-tip='Clear'
          onClick={clearSearch}
        >
          <IoMdClose />
        </button>
      ) : (
        <IoSearch />
      )}
    </label>
  )
}

export default SearchInput
