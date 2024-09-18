import { useField } from 'formik'
import { FC } from 'react'

interface IFileInputProps {
  name: string

  // Optional
}

const FileInput: FC<IFileInputProps> = (props) => {
  const [field, meta] = useField(props)

  return (
    <label className='form-control w-full '>
      <div className='label'>
        <span className='label-text'>Profile picture</span>
      </div>
      <input
        type='file'
        {...field}
        {...props}
        className='file-input file-input-bordered w-full dark:bg-gray-900'
      />
      {meta.touched && Boolean(meta.error) && (
        <div className='label'>
          <span className='label-text-alt text-red-500'>{meta.error}</span>
        </div>
      )}
    </label>
  )
}

export default FileInput
