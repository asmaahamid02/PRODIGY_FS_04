import { EGender, IUserRequest } from '../types/user.type'
import { Request } from 'express'
import { validateRequiredFields } from './validation.util'
import Validator from 'validator'

// Utility function to validate username format
const validateUsername = (username: string) => {
  const isLengthValid = Validator.isLength(username.trim(), { min: 5, max: 20 })
  const isAlphanumeric = Validator.isAlphanumeric(username)

  if (!isLengthValid || !isAlphanumeric) {
    throw new Error(
      'Invalid username. Must contain 5-20 alphanumeric characters.'
    )
  }
}

// Utility function to validate password format
const validatePassword = (password: string) => {
  const isLengthValid = Validator.isLength(password.trim(), { min: 8, max: 20 })
  const isStrongPassword = Validator.isStrongPassword(password)

  if (!isLengthValid || !isStrongPassword) {
    throw new Error(
      'Invalid password. Must be 8-20 characters long and include uppercase, lowercase, number, and special character.'
    )
  }
}

// Utility function to check if passwords match
const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword
}

// Utility function to validate gender against enum
const validateGender = (gender: string, validGenders: string[]) => {
  if (!validGenders.includes(gender)) {
    throw new Error(
      `Invalid gender. Allowed values are: ${validGenders.join(', ')}`
    )
  }
}

export const validateSignupRequest = (body: IUserRequest) => {
  const { username, password, confirmPassword, gender } = body

  validateRequiredFields(body, [
    'fullName',
    'username',
    'password',
    'confirmPassword',
    'gender',
  ])

  validateUsername(username)
  validatePassword(password)
  if (!passwordsMatch(password, confirmPassword)) {
    throw new Error('Passwords do not match!')
  }
  validateGender(gender, Object.values(EGender))
}
