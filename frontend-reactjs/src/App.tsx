import { Toaster } from 'react-hot-toast'
import MainRoutes from './routes/Routes'

function App() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <MainRoutes />
      <Toaster position='bottom-center' />
    </div>
  )
}

export default App
