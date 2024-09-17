export interface IUserBody {
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
