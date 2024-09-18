import { ObjectId } from 'mongodb'
export interface IMessageBody {
  message: string
  groupId?: ObjectId
  receiverId?: ObjectId
}
