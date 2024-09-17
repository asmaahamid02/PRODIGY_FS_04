import { ObjectId } from 'mongodb'
export interface ITokenPayload {
  userId: ObjectId
  username: string
}
