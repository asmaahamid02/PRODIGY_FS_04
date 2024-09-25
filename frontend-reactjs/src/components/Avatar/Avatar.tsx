import { FC } from 'react'

interface IAvatarProps {
  src: string
  alt: string
  width?: string
  isOnline?: boolean
}

const Avatar: FC<IAvatarProps> = ({
  width = 'w-10 md:w-12',
  src,
  alt,
  isOnline = false,
}) => {
  return (
    <div className={`shrink-0 avatar ${isOnline ? 'online' : 'offline'}`}>
      <div className={`rounded-full ${width}`}>
        <img src={src} alt={alt} />
      </div>
    </div>
  )
}

export default Avatar
