import { Request, Response } from 'express'
import User from '../models/user.model'
import { getErrorMessage } from '../utils/error.util'

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.search

    if (keyword === '') {
      return res.status(400).json({ error: 'Search keyword is required!' })
    }
    const users = await User.find({
      $or: [
        { fullName: { $regex: keyword, $options: 'i' } },
        { username: { $regex: keyword, $options: 'i' } },
      ],
    })
      .find({ _id: { $ne: req.user?._id } })
      .select('-password')

    if (!users) {
      return res.status(200).json([])
    }

    return res.status(200).json(users)
  } catch (error: unknown) {
    console.log(
      getErrorMessage(error, 'Error in User Controller - searchUsers API')
    )
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
