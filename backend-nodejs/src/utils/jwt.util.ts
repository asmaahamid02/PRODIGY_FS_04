import jwt from 'jsonwebtoken'
import { ITokenPayload } from '../types/auth.type'

const createToken = (payload: ITokenPayload) => {
  const defaultSecret = 'default-secret'
  //generate JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET || defaultSecret, {
    expiresIn: '1d',
  })

  return token
}

export { createToken }
