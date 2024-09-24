import { Types } from 'mongoose'
import { IUser } from './user.type'
import { IRoom } from './room.type'

export interface IMessage {
  _id: Types.ObjectId
  message: string
  sender: IUser
  room: IRoom
  updatedAt: Date
  createdAt: Date
}
