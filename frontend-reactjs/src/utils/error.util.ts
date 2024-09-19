import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const handleError = (error: unknown, prefix: string = '') => {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.error || error.message)

    return
  } else if (error instanceof Error) {
    toast.error(error.message)

    return
  }

  const messagePrefix = prefix ? `${prefix}: ` : ''
  console.log(`${messagePrefix}An unknown error occurred.`)
  toast.error('An unknown error occurred.')
}
