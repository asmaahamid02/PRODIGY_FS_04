import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { ITokenPayload } from '../types/auth.type'

const createToken = (payload: ITokenPayload, res: Response) => {
  //generate JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  })

  //set the token in the cookie
  res.cookie('jwt', token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day (in milliseconds)
    httpOnly: true, //prevent XSS attacks (cross-site scripting attacks)
    sameSite: 'strict', //CSRF attacks (cross-site request forgery attacks)
    secure: process.env.NODE_ENV === 'production', //HTTPS only in production
  })
}

export default createToken
