import { PathConstants } from './PathConstants'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const ProtectedRoute = () => {
  const { authUser } = useAuthContext()
  return authUser ? <Outlet /> : <Navigate to={PathConstants.AUTH} />
}

export default ProtectedRoute
