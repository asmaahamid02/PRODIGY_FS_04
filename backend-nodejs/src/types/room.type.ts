import { Types } from 'mongoose'
import { IMessage } from './message.type'

export interface IRoom {
  _id: Types.ObjectId
  participants: Types.ObjectId[]
  lastMessage: IMessage
  updatedAt: Date
  createdAt: Date
  isGroup: boolean
  groupName?: string
  groupAdmin?: Types.ObjectId
}
