import { useField } from 'formik'
import { FC, ReactNode } from 'react'

interface ITextInputProps {
  name: string
  type: string
  placeholder: string

  // Optional
  prefix?: ReactNode
  suffix?: ReactNode
}

const TextInput: FC<ITextInputProps> = ({ prefix, suffix, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <label className='form-control w-full'>
      <label className='input input-bordered flex items-center gap-2'>
        {prefix}
        <input {...field} {...props} className='grow' />
        {suffix}
      </label>
      {meta.touched && Boolean(meta.error) && (
        <div className='label'>
          <span className='label-text-alt text-red-500'>{meta.error}</span>
        </div>
      )}
    </label>
  )
}

export default TextInput
