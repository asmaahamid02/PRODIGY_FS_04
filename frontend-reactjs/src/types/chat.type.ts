import { IUser } from './user.type'

export interface IRoom {
  _id: string
  participants: IUser[]
  isGroup: boolean
  groupName?: string
  groupAdmin?: IUser
  lastMessage: IMessage | null
  unreadCount?: number
}

export interface IMessage {
  _id: string
  sender: IUser
  room: string | IRoom
  message: string
  readBy?: [
    {
      reader: string
      readAt: string
    }
  ]
  createdAt: string
  updatedAt: string
}
