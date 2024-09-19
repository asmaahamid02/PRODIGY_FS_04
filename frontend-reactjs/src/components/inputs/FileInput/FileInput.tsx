import { ChangeEvent, FC } from 'react'

interface IFileInputProps {
  name: string
  label: string
  accept?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const FileInput: FC<IFileInputProps> = (props) => {
  return (
    <label className='form-control w-full'>
      <div className='label'>
        <span className='label-text'>Profile picture</span>
      </div>
      <input
        type='file'
        className='file-input file-input-bordered w-full'
        {...props}
      />
    </label>
  )
}

export default FileInput
