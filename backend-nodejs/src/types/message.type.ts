import { Types } from 'mongoose'
import { IUserBasicInfo } from './user.type'
import { IRoom } from './room.type'

export interface IMessage {
  _id: Types.ObjectId
  message: string
  sender: IUserBasicInfo
  room: IRoom
  updatedAt: Date
  createdAt: Date
}
