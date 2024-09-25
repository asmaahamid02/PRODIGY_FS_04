import { Types } from 'mongoose'
import { IUser } from './user.type'
import { IRoom } from './room.type'

export interface IMessage {
  _id: Types.ObjectId
  message: string
  sender: IUser | Types.ObjectId
  room: IRoom | Types.ObjectId
  updatedAt: Date
  createdAt: Date
  readBy?: { reader?: IUser | Types.ObjectId | null; readAt?: Date | null }[]
}
