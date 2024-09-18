import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FC } from 'react'

interface IPasswordAdornmentProps {
  show: boolean
  onClick: () => void
}

const PasswordAdornment: FC<IPasswordAdornmentProps> = ({ show, onClick }) => {
  return (
    <button type='button' tabIndex={-1} onClick={onClick}>
      {show ? <FaEyeSlash /> : <FaEye />}
    </button>
  )
}

export default PasswordAdornment
