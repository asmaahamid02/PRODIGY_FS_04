export enum EGender {
  Male = 'male',
  Female = 'female',
}

export interface ISignupFormValues {
  fullName?: string
  username: string
  password: string
  confirmPassword?: string
  gender?: EGender

  profilePicture?: File | null
}
