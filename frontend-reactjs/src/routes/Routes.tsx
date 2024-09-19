import { Routes, Route } from 'react-router-dom'
import { PathConstants } from './PathConstants'
import AuthPage from '../pages/AuthPage'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'

const MainRoutes = () => {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={PathConstants.AUTH} element={<AuthPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={PathConstants.HOME} element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default MainRoutes
