import { IUser } from '../types/user.type'
import { STORED_USER_KEY } from '../utils/constants.util'

export const saveUserToLocalStorage = (user: IUser): void => {
  localStorage.setItem(STORED_USER_KEY, JSON.stringify(user))
}

export const removeUserFromLocalStorage = (): void => {
  localStorage.removeItem(STORED_USER_KEY)
}

export const getUserFromLocalStorage = (): IUser | null => {
  return JSON.parse(localStorage.getItem(STORED_USER_KEY) as string) as IUser
}
