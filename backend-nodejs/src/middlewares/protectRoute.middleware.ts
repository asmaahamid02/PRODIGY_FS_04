import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { getErrorMessage } from '../utils/error.util'
import { ITokenPayload } from '../types/auth.type'
import User from '../models/user.model'

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' })
    }

    const user = await User.findById((decoded as ITokenPayload).userId).select(
      '-password'
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    req.user = user

    next()
  } catch (error: unknown) {
    console.log(getErrorMessage(error, 'Error in Protect Route Middleware'))
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}

export default protectRoute
