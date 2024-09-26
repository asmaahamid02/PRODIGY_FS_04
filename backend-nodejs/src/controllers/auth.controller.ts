import { Request, Response } from 'express'
import User from '../models/user.model'
import { getErrorMessage } from '../utils/error.util'
import { IUserRequest } from '../types/user.type'
import { validateSignupRequest } from '../utils/authValidation.util'
import bcrypt from 'bcryptjs'
import { createToken } from '../utils/jwt.util'
import { validateRequiredFields } from '../utils/validation.util'
import { generateProfilePictureUrl } from '../utils/profile.util'

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, gender }: IUserRequest = req.body

    //Validate the request body
    validateSignupRequest(req.body)

    //check if the user has an account
    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists!' })
    }

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //generate a profile picture
    const profilePicture = generateProfilePictureUrl(username, gender)

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePicture,
    })

    await newUser.save()

    //generate JWT token
    const token = createToken({
      userId: newUser._id,
      username,
    })

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePicture: newUser.profilePicture,
      gender: newUser.gender,
      createdAt: newUser.createdAt,
      token,
    })
  } catch (error: unknown) {
    console.log(getErrorMessage(error, 'Error in Auth Controller - Signup API'))
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password }: IUserRequest = req.body

    validateRequiredFields(req.body, ['username', 'password'])

    const user = await User.findOne({ username })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials!' })
    }

    const token = createToken({ userId: user._id, username })

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePicture: user.profilePicture,
      gender: user.gender,
      createdAt: user.createdAt,
      token,
    })
  } catch (error: unknown) {
    console.log(getErrorMessage(error, 'Error in Auth Controller - Login API'))
    return res.status(500).json({ error: 'Internal Server Error!' })
  }
}
