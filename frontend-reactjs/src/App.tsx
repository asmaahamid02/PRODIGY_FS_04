import { Toaster } from 'react-hot-toast'
import MainRoutes from './routes/Routes'

function App() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950'>
      <MainRoutes />
      <Toaster position='bottom-center' />
    </div>
  )
}

export default App
