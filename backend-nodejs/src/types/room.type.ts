import { Types } from 'mongoose'
import { IMessage } from './message.type'
import { IUser } from './user.type'
import { Document } from 'mongoose'

export interface IRoom {
  _id: Types.ObjectId
  participants: Types.ObjectId[] | IUser[]
  lastMessage?: IMessage | Types.ObjectId | null
  updatedAt: Date
  createdAt: Date
  isGroup: boolean
  groupName?: string | null
  groupAdmin?: Types.ObjectId | IUser | null
}

export interface IRoomDocument extends IRoom, Document {
  _id: Types.ObjectId
}
