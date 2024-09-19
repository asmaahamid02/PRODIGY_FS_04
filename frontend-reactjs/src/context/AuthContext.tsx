import { createContext, ReactNode, useState } from 'react'
import { IUser } from '../types/user.type'
import { getUserFromLocalStorage } from '../services/localStorage.service'

type IProps = {
  children?: ReactNode
}

type IAuthContext = {
  authUser: IUser | null
  setAuthUser: (newState: IUser | null) => void
}

const initialValues: IAuthContext = {
  authUser: null,
  setAuthUser: () => {},
}

export const AuthContext = createContext<IAuthContext>(initialValues)

export const AuthContextProvider = ({ children }: IProps) => {
  const [authUser, setAuthUser] = useState(
    getUserFromLocalStorage || initialValues.authUser
  )

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  )
}
