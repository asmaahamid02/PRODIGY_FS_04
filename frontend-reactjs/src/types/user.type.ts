export enum EGender {
  Male = 'male',
  Female = 'female',
}

export interface IUser {
  _id: string
  fullName: string
  username: string
  gender: string
  profilePicture: string
  createdAt: Date
  token?: string
}

export interface IAuthResponse extends IUser {
  error?: string
}
