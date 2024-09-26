import axios from 'axios'
import { BASEURL } from '../utils/constants.util'
import { getUserFromLocalStorage } from './localStorage.service'

export const api = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getUserFromLocalStorage()?.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const axiosInterceptor = (logout: () => void) => {
  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error?.response?.status === 401) {
        logout()
      }
      return Promise.reject(error)
    }
  )
}

export default axiosInterceptor
