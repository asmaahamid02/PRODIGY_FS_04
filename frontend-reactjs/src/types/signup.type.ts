import { EGender } from './user.type'

export interface ISignupFormValues {
  fullName?: string
  username: string
  password: string
  confirmPassword: string
  gender: EGender

  profilePicture?: File | null
}
