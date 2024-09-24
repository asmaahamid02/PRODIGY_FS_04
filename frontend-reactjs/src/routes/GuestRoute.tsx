import { Navigate, Outlet } from 'react-router-dom'
import { PathConstants } from './PathConstants'
import { useAuthContext } from '../hooks/context/useAuthContext'

const GuestRoute = () => {
  const { authUser } = useAuthContext()

  return authUser ? <Navigate to={PathConstants.HOME} /> : <Outlet />
}

export default GuestRoute
