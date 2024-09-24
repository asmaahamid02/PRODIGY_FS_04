import { ObjectId } from 'mongodb'

export interface IUserRequest {
  fullName: string
  username: string
  password: string
  confirmPassword: string
  gender: EGender
}

export enum EGender {
  Male = 'male',
  Female = 'female',
}

export interface IUser {
  _id: ObjectId
  fullName: string
  username: string
  gender: string
  profilePicture: string
  createdAt: NativeDate
  token?: string
}
