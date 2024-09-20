import { IUser } from './user.type'

export interface IRoom {
  _id: string
  participants: IUser[]
  isGroup: boolean
  groupName?: string
  groupAdmin?: IUser
  lastMessage: IMessage | null
}

export interface IMessage {
  _id: string
  sender: IUser
  room: string
  message: string
  createdAt: string
  updatedAt: string
}
