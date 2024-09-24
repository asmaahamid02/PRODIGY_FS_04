import jwt from 'jsonwebtoken'
import { ITokenPayload } from '../types/auth.type'

const createToken = (payload: ITokenPayload) => {
  //generate JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  })

  return token
}

export { createToken }
