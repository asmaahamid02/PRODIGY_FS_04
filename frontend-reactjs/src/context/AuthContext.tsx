import { createContext, ReactNode, useState } from 'react'
import { IUser } from '../types/user.type'
import { getUserFromLocalStorage } from '../services/localStorage.service'

type IProps = {
  children?: ReactNode
}

type TAuthContext = {
  authUser: IUser | null
  setAuthUser: (newState: IUser | null) => void
}

const initialValues: TAuthContext = {
  authUser: null,
  setAuthUser: () => {},
}

export const AuthContext = createContext<TAuthContext>(initialValues)

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
